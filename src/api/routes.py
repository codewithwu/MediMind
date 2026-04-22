import os
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException
from src.models.schemas import UploadResponse, TaskStatus, AnalysisResult
from src.services.pdf_processor import PDFProcessor
from src.services.analyzer import TaskManager
from src.agents.agents import (
    Cardiologist,
    Psychologist,
    Pulmonologist,
    MultidisciplinaryTeam,
)
from concurrent.futures import ThreadPoolExecutor, as_completed
from src.agents.agents import Agent

router = APIRouter()
pdf_processor = PDFProcessor()
task_manager = TaskManager()


def get_response(agent_name: str, agent: Agent) -> tuple[str, str | None]:
    response = agent.run()
    return agent_name, response


@router.post("/api/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="只支持 PDF 格式")

    if not file or file.filename == "":
        raise HTTPException(status_code=400, detail="文件不能为空")

    content = await file.read()
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="文件大小超过限制（最大10MB）")
    task_id = pdf_processor.save_pdf(content)

    # 先在 task_manager 中创建任务
    task_manager.tasks[task_id] = task_manager.tasks.get(
        task_id,
        type("Task", (), {
            "task_id": task_id,
            "status": "pending",
            "progress": {
                "Cardiologist": None,
                "Psychologist": None,
                "Pulmonologist": None,
                "MultidisciplinaryTeam": None,
            },
            "final_report": None,
            "error": None,
        })(),
    )

    # 异步启动分析任务
    from threading import Thread

    def analyze_task():
        try:
            task_manager.update_progress(task_id, "Cardiologist", "pending")
            pdf_text = pdf_processor.load_pdf(task_id)
            if not pdf_text:
                task_manager.set_failed(task_id, "PDF 解析失败")
                return

            task_manager.update_progress(task_id, "Cardiologist", "analyzing")
            task_manager.update_progress(task_id, "Psychologist", "analyzing")
            task_manager.update_progress(task_id, "Pulmonologist", "analyzing")

            agents = {
                "Cardiologist": Cardiologist(pdf_text),
                "Psychologist": Psychologist(pdf_text),
                "Pulmonologist": Pulmonologist(pdf_text),
            }

            responses = {}
            with ThreadPoolExecutor() as executor:
                futures = {
                    executor.submit(get_response, name, agent): name
                    for name, agent in agents.items()
                }
                for future in as_completed(futures):
                    agent_name, response = future.result()
                    responses[agent_name] = response
                    task_manager.update_progress(task_id, agent_name, "completed")

            task_manager.update_progress(task_id, "MultidisciplinaryTeam", "analyzing")
            team_agent = MultidisciplinaryTeam(
                cardiologist_report=responses["Cardiologist"],
                psychologist_report=responses["Psychologist"],
                pulmonologist_report=responses["Pulmonologist"],
            )
            final_report = team_agent.run()

            # 保存结果
            result_path = f"results/{task_id}.md"
            os.makedirs("results", exist_ok=True)
            with open(result_path, "w") as f:
                f.write(final_report)

            task_manager.set_result(task_id, final_report)
            task_manager.update_progress(task_id, "MultidisciplinaryTeam", "completed")
        except Exception as e:
            logging.error(f"任务 {task_id} 执行失败: {e}")
            task_manager.set_failed(task_id, str(e))

    thread = Thread(target=analyze_task)
    thread.start()

    return UploadResponse(
        task_id=task_id, status="pending", message="文件已上传，分析中"
    )


@router.get("/api/task/{task_id}", response_model=TaskStatus)
def get_task_status(task_id: str):
    status = task_manager.get_status(task_id)
    if not status:
        raise HTTPException(status_code=404, detail="任务不存在")
    return TaskStatus(**status)


@router.get("/api/result/{task_id}", response_model=AnalysisResult)
def get_result(task_id: str):
    result = task_manager.get_result(task_id)
    if not result:
        raise HTTPException(status_code=404, detail="任务不存在")
    if result["status"] not in ["completed", "failed"]:
        raise HTTPException(status_code=400, detail="分析尚未完成")
    return AnalysisResult(**result)


@router.get("/api/health")
def health_check():
    return {"status": "ok"}
