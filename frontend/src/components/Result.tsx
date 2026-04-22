import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

interface ResultProps {
  taskId: string;
}

export default function Result({ taskId }: ResultProps) {
  const [status, setStatus] = useState<any>(null);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const statusRes = await axios.get(`http://localhost:8000/api/task/${taskId}`);
        setStatus(statusRes.data);
        if (statusRes.data.status === "completed") {
          const resultRes = await axios.get(`http://localhost:8000/api/result/${taskId}`);
          setReport(resultRes.data.report);
          clearInterval(poll);
        } else if (statusRes.data.status === "failed") {
          setError("分析失败");
          clearInterval(poll);
        }
      } catch (err) {
        setError("获取结果失败");
        clearInterval(poll);
      }
    }, 2000);
    return () => clearInterval(poll);
  }, [taskId]);

  if (error) return <div className="error">{error}</div>;
  if (!status) return <div>加载中...</div>;

  return (
    <div className="result-container">
      <h2>分析进度</h2>
      <div className="progress">
        {Object.entries(status.progress || {}).map(([key, value]) => (
          <div key={key} className={`progress-item ${value}`}>
            {key}: {value || "等待中"}
          </div>
        ))}
      </div>
      {report && (
        <div className="report">
          <h3>分析报告</h3>
          <ReactMarkdown>{report}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}