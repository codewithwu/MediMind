# MediMind

AI 多智能体医疗诊断分析系统。

## 功能概述

MediMind 使用多智能体协作的方式，对医疗报告进行综合分析。系统包含四个 AI 角色：

1. **心脏病专家 (Cardiologist)** - 分析心脏相关检查结果（心电图、血液检查、动态心电监护、心脏超声）
2. **心理专家 (Psychologist)** - 评估心理状态，识别焦虑、抑郁等问题
3. **肺科专家 (Pulmonologist)** - 评估呼吸系统状况，识别哮喘、慢阻肺等问题
4. **多学科团队 (MultidisciplinaryTeam)** - 汇总三科意见，列出 3 个最可能的健康问题及原因

## 技术栈

**后端**
- FastAPI - Web 框架
- LangChain - LLM 应用开发框架
- DeepSeek API - 语言模型

**前端**
- React 19 + TypeScript
- Vite - 构建工具

## 项目结构

```
MediMind/
├── src/
│   ├── main.py              # FastAPI 应用入口
│   ├── api/routes.py        # API 路由定义
│   ├── agents/agents.py     # AI 智能体实现
│   ├── models/schemas.py    # 数据模型
│   └── services/           # 业务服务
│       ├── pdf_processor.py  # PDF 处理
│       └── analyzer.py       # 分析任务管理
├── frontend/               # React 前端
├── tests/                  # 测试文件
└── pyproject.toml         # Python 依赖配置
```

## 快速启动

### 1. 环境配置

```bash
# 安装依赖
uv sync

# 复制环境变量文件
cp .env.example .env

# 编辑 .env，填入你的 DeepSeek API Key
DEEPSEEK_API_KEY=your_api_key_here
```

### 2. 启动后端

```bash
source .venv/bin/activate
uv run uvicorn src.main:app --reload --port 8000
```

后端运行在 http://127.0.0.1:8000

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 http://localhost:5173

### 4. 使用系统

1. 打开前端页面 http://localhost:5173
2. 上传 PDF 格式的医疗报告
3. 等待 AI 分析完成
4. 查看综合诊断结果

## API 文档

启动后端后访问：
- API 文档：http://127.0.0.1:8000/docs
- 健康检查：http://127.0.0.1:8000/api/health

### 主要接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/upload` | 上传 PDF 医疗报告 |
| GET | `/api/task/{task_id}` | 查询分析任务状态 |
| GET | `/api/result/{task_id}` | 获取分析结果 |

## 开发

```bash
# 代码检查
uv run ruff check .

# 代码格式化
uv run ruff format .

# 运行测试
uv run pytest -v

# 类型检查
uv run mypy src/
```

## 许可证

MIT