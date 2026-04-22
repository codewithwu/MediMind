import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./Result.css";

interface ResultProps {
  taskId: string;
}

interface Progress {
  Cardiologist?: string | null;
  Psychologist?: string | null;
  Pulmonologist?: string | null;
  MultidisciplinaryTeam?: string | null;
}

const agentLabels: Record<string, string> = {
  Cardiologist: "心脏病专家",
  Psychologist: "心理专家",
  Pulmonologist: "肺科专家",
  MultidisciplinaryTeam: "多学科团队",
};

const agentIcons: Record<string, JSX.Element> = {
  Cardiologist: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Psychologist: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  ),
  Pulmonologist: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3c-1.5 0-2.5 1-3 2-.5-1-1.5-2-3-2-2 0-4 2-4 5 0 4 3 8 6 10 1 .6 2 1 4 1s3-.4 4-1c3-2 6-6 6-10 0-3-2-5-4-5-1.5 0-2.5 1-3 2-.5-1-1.5-2-3-2z"/>
    </svg>
  ),
  MultidisciplinaryTeam: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="7" r="4"/>
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
      <circle cx="17" cy="7" r="3"/>
      <path d="M21 21v-2a3 3 0 0 0-2-2.8"/>
    </svg>
  ),
};

export default function Result({ taskId }: ResultProps) {
  const [status, setStatus] = useState<{ status: string; progress?: Progress } | null>(null);
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
          setError("分析失败，请重试");
          clearInterval(poll);
        }
      } catch (err) {
        setError("获取结果失败");
        clearInterval(poll);
      }
    }, 2000);
    return () => clearInterval(poll);
  }, [taskId]);

  if (error) {
    return (
      <div className="result-container">
        <div className="error-card">
          <div className="error-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3>分析失败</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="result-container">
        <div className="loading-card">
          <div className="loading-spinner" />
          <p>正在连接分析服务...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="result-container">
      <div className="progress-header">
        <h2>AI 分析进度</h2>
        <div className="task-id">
          <span>任务 ID</span>
          <code>{taskId}</code>
        </div>
      </div>

      <div className="progress-grid">
        {Object.entries(status.progress || {}).map(([key, value], index) => (
          <div
            key={key}
            className={`agent-card ${value}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="agent-icon">
              {agentIcons[key]}
            </div>
            <div className="agent-info">
              <span className="agent-label">{agentLabels[key]}</span>
              <span className="agent-status">
                {value === "completed" && "✓ 已完成"}
                {value === "analyzing" && "分析中..."}
                {value === "pending" && "等待中"}
                {!value && "等待中"}
              </span>
            </div>
            <div className={`agent-indicator ${value}`}>
              {value === "completed" && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
              {value === "analyzing" && <div className="pulse" />}
            </div>
          </div>
        ))}
      </div>

      {report && (
        <div className="report-section">
          <div className="report-header">
            <h3>综合诊断报告</h3>
            <div className="report-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>AI 生成</span>
            </div>
          </div>
          <div className="report-content markdown-content">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}