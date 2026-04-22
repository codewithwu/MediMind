from src.services.analyzer import AnalysisTask, TaskManager


def test_task_initialization():
    task = AnalysisTask(task_id="test-123", pdf_text="Test content")
    assert task.task_id == "test-123"
    assert task.status == "pending"


def test_task_manager_create():
    manager = TaskManager()
    task_id = manager.create_task("Sample PDF text")
    assert task_id is not None
    assert manager.get_status(task_id)["status"] == "pending"
