import os
import uuid
from typing import Optional

from langchain_community.document_loaders import PyPDFLoader


class PDFProcessor:
    """PDF 文件处理服务"""

    def __init__(self, upload_dir: str = "uploads"):
        """
        初始化 PDF 处理服务

        Args:
            upload_dir: PDF 文件存储目录
        """
        self.upload_dir = upload_dir
        os.makedirs(upload_dir, exist_ok=True)

    def save_pdf(self, file_content: bytes) -> str:
        """
        保存上传的 PDF 文件

        Args:
            file_content: PDF 文件的字节内容

        Returns:
            任务 ID (UUID)
        """
        task_id = str(uuid.uuid4())
        file_path = os.path.join(self.upload_dir, f"{task_id}.pdf")
        with open(file_path, "wb") as f:
            f.write(file_content)
        return task_id

    def load_pdf(self, task_id: str) -> Optional[str]:
        """
        使用 PyPDFLoader 加载并解析 PDF

        Args:
            task_id: PDF 文件的任务 ID

        Returns:
            PDF 文本内容，如果文件不存在则返回 None
        """
        file_path = os.path.join(self.upload_dir, f"{task_id}.pdf")
        if not os.path.exists(file_path):
            return None
        try:
            loader = PyPDFLoader(file_path)
            documents = loader.load()
            text = "\n".join([doc.page_content for doc in documents])
            return text
        except FileNotFoundError:
            return None
        except Exception as e:
            raise RuntimeError(f"PDF 解析失败: {str(e)}") from e

    def get_file_path(self, task_id: str) -> str:
        """
        获取 PDF 文件路径

        Args:
            task_id: PDF 文件的任务 ID

        Returns:
            PDF 文件的完整路径
        """
        return os.path.join(self.upload_dir, f"{task_id}.pdf")
