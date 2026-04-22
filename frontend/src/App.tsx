import { useState } from "react";
import Upload from "./components/Upload";
import Result from "./components/Result";
import "./App.css";

function App() {
  const [taskId, setTaskId] = useState<string | null>(null);

  return (
    <div className="app">
      {/* 背景装饰 */}
      <div className="bg-decoration">
        <div className="bg-circle circle-1" />
        <div className="bg-circle circle-2" />
        <div className="bg-line" />
      </div>

      <header className="header">
        <div className="logo">
          <svg className="logo-icon" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M24 12v12l8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="24" cy="24" r="3" fill="currentColor"/>
          </svg>
          <span className="logo-text">MediMind</span>
        </div>
        <p className="tagline">AI 多智能体医疗诊断分析系统</p>
      </header>

      <main className="main">
        {!taskId ? (
          <Upload onAnalysisComplete={setTaskId} />
        ) : (
          <Result taskId={taskId} />
        )}
      </main>

      <footer className="footer">
        <div className="agents-badge">
          <span className="agents-label">AI 专家团队</span>
          <div className="agents-icons">
            <div className="agent-icon" title="心脏病专家">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div className="agent-icon" title="心理专家">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </div>
            <div className="agent-icon" title="肺科专家">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3c-1.5 0-2.5 1-3 2-.5-1-1.5-2-3-2-2 0-4 2-4 5 0 4 3 8 6 10 1 .6 2 1 4 1s3-.4 4-1c3-2 6-6 6-10 0-3-2-5-4-5-1.5 0-2.5 1-3 2-.5-1-1.5-2-3-2z"/>
              </svg>
            </div>
            <div className="agent-icon team" title="多学科团队">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="7" r="4"/>
                <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                <circle cx="17" cy="7" r="3"/>
                <path d="M21 21v-2a3 3 0 0 0-2-2.8"/>
              </svg>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;