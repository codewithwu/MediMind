# tests/test_models.py
from src.models.schemas import UploadResponse, TaskStatus, AnalysisResult, Progress


def test_upload_response_schema():
    response = UploadResponse(task_id="test-uuid", status="pending")
    assert response.task_id == "test-uuid"
    assert response.status == "pending"


def test_task_status_schema():
    progress = Progress(Cardiologist="completed", Psychologist="analyzing")
    status = TaskStatus(task_id="test-uuid", status="analyzing", progress=progress)
    assert status.progress.Cardiologist == "completed"


def test_analysis_result_schema():
    result = AnalysisResult(task_id="test-uuid", status="completed", report="# Test")
    assert result.status == "completed"
    assert "# Test" in result.report
