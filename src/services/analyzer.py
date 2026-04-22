import uuid
from typing import Dict, Optional


class AnalysisTask:
    """分析任务类，用于管理单个PDF分析任务的状态和进度"""

    def __init__(self, task_id: str, pdf_text: str):
        self.task_id = task_id
        self.pdf_text = pdf_text
        self.status = "pending"
        self.progress = {
            "Cardiologist": None,
            "Psychologist": None,
            "Pulmonologist": None,
            "MultidisciplinaryTeam": None,
        }
        self.results = {}
        self.final_report = None
        self.error = None


class TaskManager:
    """任务管理器，用于创建和管理多个分析任务"""

    def __init__(self):
        self.tasks: Dict[str, AnalysisTask] = {}

    def create_task(self, pdf_text: str) -> str:
        """创建新任务并返回任务ID"""
        task_id = str(uuid.uuid4())
        task = AnalysisTask(task_id, pdf_text)
        self.tasks[task_id] = task
        return task_id

    def get_status(self, task_id: str) -> Optional[Dict]:
        """获取任务状态"""
        task = self.tasks.get(task_id)
        if not task:
            return None
        return {
            "task_id": task.task_id,
            "status": task.status,
            "progress": task.progress,
        }

    def get_result(self, task_id: str) -> Optional[Dict]:
        """获取任务结果"""
        task = self.tasks.get(task_id)
        if not task:
            return None
        return {
            "task_id": task.task_id,
            "status": task.status,
            "report": task.final_report,
        }

    def update_progress(self, task_id: str, agent: str, status: str):
        """更新任务中指定agent的进度"""
        if task_id in self.tasks:
            self.tasks[task_id].progress[agent] = status

    def set_result(self, task_id: str, report: str):
        """设置任务结果并标记为完成"""
        if task_id in self.tasks:
            self.tasks[task_id].final_report = report
            self.tasks[task_id].status = "completed"

    def set_failed(self, task_id: str, error: str):
        """标记任务失败"""
        if task_id in self.tasks:
            self.tasks[task_id].status = "failed"
            self.tasks[task_id].error = error
