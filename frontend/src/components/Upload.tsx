import { useState } from "react";
import axios from "axios";

interface UploadProps {
  onAnalysisComplete: (taskId: string) => void;
}

export default function Upload({ onAnalysisComplete }: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post("http://localhost:8000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onAnalysisComplete(response.data.task_id);
    } catch (error) {
      alert("上传失败");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>上传体检报告</h2>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "上传中..." : "开始分析"}
      </button>
    </div>
  );
}