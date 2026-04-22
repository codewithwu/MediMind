import os
from src.services.pdf_processor import PDFProcessor


def test_pdf_processor_initialization():
    """测试 PDFProcessor 初始化"""
    processor = PDFProcessor()
    assert processor.upload_dir == "uploads"


def test_pdf_processor_save_and_load(tmp_path):
    """测试 PDF 保存和加载功能"""
    # 创建测试 PDF 内容（模拟）
    test_content = b"%PDF-1.4 test content"
    processor = PDFProcessor(upload_dir=str(tmp_path))
    task_id = processor.save_pdf(test_content)
    assert task_id is not None
    assert os.path.exists(tmp_path / f"{task_id}.pdf")


def test_pdf_processor_load_nonexistent(tmp_path):
    """测试加载不存在的 PDF"""
    processor = PDFProcessor(upload_dir=str(tmp_path))
    result = processor.load_pdf("nonexistent-id")
    assert result is None


def test_get_file_path(tmp_path):
    """测试获取文件路径"""
    processor = PDFProcessor(upload_dir=str(tmp_path))
    task_id = "test-task-id"
    file_path = processor.get_file_path(task_id)
    assert file_path == str(tmp_path / f"{task_id}.pdf")
