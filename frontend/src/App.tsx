import { useState } from "react";
import Upload from "./components/Upload";
import Result from "./components/Result";

function App() {
  const [taskId, setTaskId] = useState<string | null>(null);

  return (
    <div className="app">
      <header>
        <h1>AI 医疗诊断分析</h1>
      </header>
      <main>
        {!taskId ? (
          <Upload onAnalysisComplete={setTaskId} />
        ) : (
          <Result taskId={taskId} />
        )}
      </main>
    </div>
  );
}

export default App;