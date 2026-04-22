# src/models/schemas.py
from pydantic import BaseModel
from typing import Optional


class UploadResponse(BaseModel):
    task_id: str
    status: str
    message: str = "文件已上传"


class Progress(BaseModel):
    Cardiologist: Optional[str] = None
    Psychologist: Optional[str] = None
    Pulmonologist: Optional[str] = None
    MultidisciplinaryTeam: Optional[str] = None


class TaskStatus(BaseModel):
    task_id: str
    status: str
    progress: Optional[Progress] = None
    message: Optional[str] = None


class AnalysisResult(BaseModel):
    task_id: str
    status: str
    report: Optional[str] = None
    error: Optional[str] = None
