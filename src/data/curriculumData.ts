import { CurriculumDay } from '../types';

export const COHORT_INFO = {
  cohort: "AI Cohort · 31 days · 8 modules",
  modules: [
    { n: 1, title: "Environment & Tooling", days: [1, 3] },
    { n: 2, title: "Data Foundations", days: [4, 6] },
    { n: 3, title: "Embeddings & Vector Search", days: [7, 10] },
    { n: 4, title: "LLM Core, Prompting & Fine-Tuning", days: [11, 15] },
    { n: 5, title: "Chatbot Application Build", days: [16, 20] },
    { n: 6, title: "Agentic AI & MCP", days: [21, 24] },
    { n: 7, title: "Evaluation, Security & Deployment", days: [25, 28] },
    { n: 8, title: "Production & Capstone", days: [29, 31] }
  ]
};

export const CURRICULUM_DATA: CurriculumDay[] = [
  {
    day: 1,
    module: "Module 1: Environment & Tooling",
    topic: "VS Code & Python Environment Setup",
    title: "VS Code & Python Environment Setup",
    type: "SETUP",
    description: "Install and configure VS Code, Python, Pylance, and virtual environments to prepare the primary AI development setup.",
    learningObjectives: [
      "Install VS Code and Python on your machine",
      "Configure the Python extension and Pylance",
      "Create and activate a project virtual environment (.venv)",
      "Run and debug your first Python program inside VS Code",
      "Verify the development environment is ready for the remaining course"
    ],
    objectives: [
      "Install VS Code and Python on your machine",
      "Configure the Python extension and Pylance",
      "Create and activate a project virtual environment (.venv)",
      "Run and debug your first Python program inside VS Code",
      "Verify the development environment is ready for the remaining course"
    ],
    tools: ["VS Code", "Python", "Python Extension", "Pylance", "Virtual Environment"],
    difficulty: "Beginner",
    keyConcepts: ["Python Environment", "VS Code", "Virtualenv", "Pylance"]
  },
  {
    day: 2,
    module: "Module 1: Environment & Tooling",
    topic: "Local LLM & AI Coding Assistant Setup",
    title: "Local LLM & AI Coding Assistant Setup",
    type: "SETUP",
    description: "Configure local LLMs via Ollama, Qwen2.5-Coder, GitHub Copilot, and Cline for privacy-first AI development.",
    learningObjectives: [
      "Install Ollama and download a local coding model",
      "Verify the local model works through the Ollama CLI",
      "Connect VS Code to the local model using GitHub Copilot or Cline",
      "Generate code using the local AI assistant",
      "Confirm the complete AI coding workflow works offline"
    ],
    objectives: [
      "Install Ollama and download a local coding model",
      "Verify the local model works through the Ollama CLI",
      "Connect VS Code to the local model using GitHub Copilot or Cline",
      "Generate code using the local AI assistant",
      "Confirm the complete AI coding workflow works offline"
    ],
    tools: ["Ollama", "Qwen2.5-Coder", "GitHub Copilot", "Cline"],
    difficulty: "Beginner",
    keyConcepts: ["Local LLM", "Ollama", "Qwen2.5-Coder", "Cline Assistant"]
  },
  {
    day: 3,
    module: "Module 1: Environment & Tooling",
    topic: "First AI Project, React Frontend & GitHub",
    title: "First AI Project, React Frontend & GitHub",
    type: "BUILD",
    description: "Scaffold a full-stack AI application combining Ollama CLI, FastAPI backend, React Vite frontend, and GitHub repository.",
    learningObjectives: [
      "Build a command-line chatbot powered by your local Ollama model",
      "Scaffold a FastAPI backend with a health endpoint",
      "Create a React application using Vite",
      "Connect the React frontend with the FastAPI backend",
      "Initialize Git, commit the project, and publish it to GitHub"
    ],
    objectives: [
      "Build a command-line chatbot powered by your local Ollama model",
      "Scaffold a FastAPI backend with a health endpoint",
      "Create a React application using Vite",
      "Connect the React frontend with the FastAPI backend",
      "Initialize Git, commit the project, and publish it to GitHub"
    ],
    tools: ["Python", "Ollama", "FastAPI", "React", "Vite", "Git", "GitHub"],
    difficulty: "Beginner",
    keyConcepts: ["FastAPI", "React Vite", "GitHub Integration", "Full-Stack Chatbot"]
  },
  {
    day: 4,
    module: "Module 2: Data Foundations",
    topic: "Reading & Processing Structured Data",
    title: "Reading & Processing Structured Data",
    type: "BUILD",
    description: "Build data pipelines for tabular structured datasets using Pandas, SQLite database queries, and SQLAlchemy ORMs.",
    learningObjectives: [
      "Create synthetic healthcare plans and claims datasets",
      "Load and clean structured CSV data using Pandas",
      "Store the processed data in a SQLite database",
      "Write SQL queries to answer common healthcare questions",
      "Document reusable SQL queries for later chatbot integration"
    ],
    objectives: [
      "Create synthetic healthcare plans and claims datasets",
      "Load and clean structured CSV data using Pandas",
      "Store the processed data in a SQLite database",
      "Write SQL queries to answer common healthcare questions",
      "Document reusable SQL queries for later chatbot integration"
    ],
    tools: ["Pandas", "SQLite", "SQL", "SQLAlchemy"],
    difficulty: "Beginner",
    keyConcepts: ["Pandas DataFrames", "SQLite", "SQLAlchemy", "Structured Data"]
  },
  {
    day: 5,
    module: "Module 2: Data Foundations",
    topic: "Reading & Processing Unstructured Data",
    title: "Reading & Processing Unstructured Data",
    type: "BUILD",
    description: "Extract and clean text from PDFs, DOCX, web scrapers, and scanned forms using OCR tools like Tesseract.",
    learningObjectives: [
      "Extract text from healthcare PDFs and Word documents",
      "Perform OCR on scanned enrollment forms",
      "Scrape useful content from a public healthcare webpage",
      "Clean and normalize extracted text from multiple sources",
      "Store the processed text files for knowledge-base creation"
    ],
    objectives: [
      "Extract text from healthcare PDFs and Word documents",
      "Perform OCR on scanned enrollment forms",
      "Scrape useful content from a public healthcare webpage",
      "Clean and normalize extracted text from multiple sources",
      "Store the processed text files for knowledge-base creation"
    ],
    tools: ["pdfplumber", "PyPDF", "python-docx", "Tesseract OCR", "BeautifulSoup", "Requests"],
    difficulty: "Beginner",
    keyConcepts: ["PDF Parsing", "Tesseract OCR", "Web Scraping", "Text Normalization"]
  },
  {
    day: 6,
    module: "Module 2: Data Foundations",
    topic: "Building the Knowledge Base",
    title: "Building the Knowledge Base",
    type: "BUILD",
    description: "Construct a unified JSONL knowledge base with document chunking, metadata attachment, and validation filters.",
    learningObjectives: [
      "Convert structured and unstructured healthcare data into a unified knowledge base",
      "Split long documents into retrieval-friendly chunks",
      "Attach metadata such as source, plan type, and document section to every chunk",
      "Export all processed records into a knowledge_base.jsonl file",
      "Validate chunk quality before using them for embeddings"
    ],
    objectives: [
      "Convert structured and unstructured healthcare data into a unified knowledge base",
      "Split long documents into retrieval-friendly chunks",
      "Attach metadata such as source, plan type, and document section to every chunk",
      "Export all processed records into a knowledge_base.jsonl file",
      "Validate chunk quality before using them for embeddings"
    ],
    tools: ["LangChain Text Splitters", "JSONL", "Python"],
    difficulty: "Beginner",
    keyConcepts: ["Document Chunking", "JSONL Export", "Metadata Tagging", "Knowledge Base"]
  },
  {
    day: 7,
    module: "Module 3: Embeddings & Vector Search",
    topic: "Embeddings Explained",
    title: "Embeddings Explained",
    type: "AI_CORE",
    description: "Vector embedding mechanics, dimensional representation, similarity metrics, and visual clustering using PCA.",
    learningObjectives: [
      "Understand how text is converted into vector embeddings",
      "Generate embeddings for every knowledge base chunk",
      "Store embeddings alongside the original documents",
      "Visualize embedding clusters using PCA",
      "Analyze whether similar healthcare concepts cluster together"
    ],
    objectives: [
      "Understand how text is converted into vector embeddings",
      "Generate embeddings for every knowledge base chunk",
      "Store embeddings alongside the original documents",
      "Visualize embedding clusters using PCA",
      "Analyze whether similar healthcare concepts cluster together"
    ],
    tools: ["Sentence Transformers", "OpenAI Embeddings", "Scikit-learn", "Matplotlib"],
    difficulty: "Intermediate",
    keyConcepts: ["Vector Embeddings", "Cosine Similarity", "PCA Dimensionality", "Semantic Clusters"]
  },
  {
    day: 8,
    module: "Module 3: Embeddings & Vector Search",
    topic: "Vector Databases Overview",
    title: "Vector Databases Overview",
    type: "BUILD",
    description: "Comparative architecture of vector stores: local ChromaDB vs cloud-hosted Pinecone index design.",
    learningObjectives: [
      "Learn the role of vector databases in RAG applications",
      "Set up a local Chroma vector database",
      "Create a cloud-based Pinecone index for comparison",
      "Compare local and managed vector database solutions",
      "Select the most suitable database for the chatbot project"
    ],
    objectives: [
      "Learn the role of vector databases in RAG applications",
      "Set up a local Chroma vector database",
      "Create a cloud-based Pinecone index for comparison",
      "Compare local and managed vector database solutions",
      "Select the most suitable database for the chatbot project"
    ],
    tools: ["ChromaDB", "Pinecone"],
    difficulty: "Intermediate",
    keyConcepts: ["ChromaDB", "Pinecone", "Vector Indexing", "RAG Infrastructure"]
  },
  {
    day: 9,
    module: "Module 3: Embeddings & Vector Search",
    topic: "Building & Populating the Vector Database",
    title: "Building & Populating the Vector Database",
    type: "BUILD",
    description: "Ingest knowledge base embeddings into vector indexes with payload filtering, metadata tags, and semantic verification.",
    learningObjectives: [
      "Load knowledge base embeddings into the vector database",
      "Store documents together with metadata for filtering",
      "Verify that every knowledge base chunk has been indexed",
      "Test semantic search with healthcare-related questions",
      "Evaluate retrieval quality and metadata filtering"
    ],
    objectives: [
      "Load knowledge base embeddings into the vector database",
      "Store documents together with metadata for filtering",
      "Verify that every knowledge base chunk has been indexed",
      "Test semantic search with healthcare-related questions",
      "Evaluate retrieval quality and metadata filtering"
    ],
    tools: ["ChromaDB", "Sentence Transformers"],
    difficulty: "Intermediate",
    keyConcepts: ["Vector Upsert", "Metadata Filtering", "Semantic Verification", "Index Population"]
  },
  {
    day: 10,
    module: "Module 3: Embeddings & Vector Search",
    topic: "The Retrieval & Matching Engine",
    title: "The Retrieval & Matching Engine",
    type: "SHIP_IT",
    description: "Architect a multi-source query router that combines SQL relational lookups with semantic vector search.",
    learningObjectives: [
      "Build a query router that decides between SQL, vector search, or hybrid retrieval",
      "Implement structured data lookup for plans and claims",
      "Implement semantic retrieval from the vector database",
      "Merge and deduplicate results from multiple retrieval sources",
      "Evaluate retrieval accuracy using a diverse set of healthcare questions"
    ],
    objectives: [
      "Build a query router that decides between SQL, vector search, or hybrid retrieval",
      "Implement structured data lookup for plans and claims",
      "Implement semantic retrieval from the vector database",
      "Merge and deduplicate results from multiple retrieval sources",
      "Evaluate retrieval accuracy using a diverse set of healthcare questions"
    ],
    tools: ["SQLite", "ChromaDB", "Python"],
    difficulty: "Intermediate",
    keyConcepts: ["Query Routing", "Hybrid Retrieval", "Deduplication", "Multi-Source Search"]
  },
  {
    day: 11,
    module: "Module 4: LLM Core, Prompting & Fine-Tuning",
    topic: "RAG End-to-End & LLM API Basics",
    title: "RAG End-to-End & LLM API Basics",
    type: "BUILD",
    description: "Assemble an end-to-end RAG pipeline linking context retrieval engines to hosted/local LLM endpoints.",
    learningObjectives: [
      "Connect the retrieval engine to an LLM to build a complete RAG pipeline",
      "Configure a local or hosted LLM provider using the OpenAI-compatible SDK",
      "Create a grounded prompt that answers only from retrieved context",
      "Generate answers using retrieved knowledge",
      "Evaluate chatbot responses against the retrieval-only baseline"
    ],
    objectives: [
      "Connect the retrieval engine to an LLM to build a complete RAG pipeline",
      "Configure a local or hosted LLM provider using the OpenAI-compatible SDK",
      "Create a grounded prompt that answers only from retrieved context",
      "Generate answers using retrieved knowledge",
      "Evaluate chatbot responses against the retrieval-only baseline"
    ],
    tools: ["OpenAI SDK", "Ollama", "Groq", "Python"],
    difficulty: "Intermediate",
    keyConcepts: ["End-to-End RAG", "Context Augmentation", "OpenAI SDK", "Grounded Prompts"]
  },
  {
    day: 12,
    module: "Module 4: LLM Core, Prompting & Fine-Tuning",
    topic: "Prompt Engineering Fundamentals",
    title: "Prompt Engineering Fundamentals",
    type: "LEARN",
    description: "Master zero-shot, few-shot exemplars, role persona boundaries, and chain-of-thought system prompts.",
    learningObjectives: [
      "Understand zero-shot, few-shot, and chain-of-thought prompting",
      "Design multiple system prompt variations for the chatbot",
      "Compare prompts based on accuracy, compliance, and tone",
      "Evaluate prompt performance using a fixed question set",
      "Finalize the production-ready system prompt"
    ],
    objectives: [
      "Understand zero-shot, few-shot, and chain-of-thought prompting",
      "Design multiple system prompt variations for the chatbot",
      "Compare prompts based on accuracy, compliance, and tone",
      "Evaluate prompt performance using a fixed question set",
      "Finalize the production-ready system prompt"
    ],
    tools: ["LLMs", "Prompt Templates"],
    difficulty: "Intermediate",
    keyConcepts: ["Few-Shot Prompting", "Chain-of-Thought", "System Instructions", "Persona Framing"]
  },
  {
    day: 13,
    module: "Module 4: LLM Core, Prompting & Fine-Tuning",
    topic: "Advanced Prompting: Function Calling & Structured Outputs",
    title: "Advanced Prompting: Function Calling & Structured Outputs",
    type: "BUILD",
    description: "Implement function declarations, automated tool invocation loops, and Pydantic schema output validation.",
    learningObjectives: [
      "Define tool schemas for healthcare-related chatbot functions",
      "Implement LLM function calling with automatic tool execution",
      "Validate structured outputs using Pydantic models",
      "Log tool calls for debugging and auditing",
      "Test different user queries to verify correct tool selection"
    ],
    objectives: [
      "Define tool schemas for healthcare-related chatbot functions",
      "Implement LLM function calling with automatic tool execution",
      "Validate structured outputs using Pydantic models",
      "Log tool calls for debugging and auditing",
      "Test different user queries to verify correct tool selection"
    ],
    tools: ["OpenAI Function Calling", "Pydantic", "Python"],
    difficulty: "Intermediate",
    keyConcepts: ["Function Calling", "Pydantic Validation", "Structured Outputs", "Tool Schemas"]
  },
  {
    day: 14,
    module: "Module 4: LLM Core, Prompting & Fine-Tuning",
    topic: "Fine-Tuning: Concepts & When to Use It",
    title: "Fine-Tuning: Concepts & When to Use It",
    type: "LEARN",
    description: "Trade-offs between prompting, RAG, and fine-tuning. Curate instruction datasets and train/test splits in JSONL.",
    learningObjectives: [
      "Understand when fine-tuning is more appropriate than prompting or RAG",
      "Identify chatbot issues that fine-tuning can solve",
      "Create a high-quality fine-tuning dataset",
      "Validate and organize the dataset into training and test sets",
      "Prepare the project for model fine-tuning"
    ],
    objectives: [
      "Understand when fine-tuning is more appropriate than prompting or RAG",
      "Identify chatbot issues that fine-tuning can solve",
      "Create a high-quality fine-tuning dataset",
      "Validate and organize the dataset into training and test sets",
      "Prepare the project for model fine-tuning"
    ],
    tools: ["JSONL", "OpenAI", "LoRA", "QLoRA"],
    difficulty: "Intermediate",
    keyConcepts: ["Fine-Tuning Trade-offs", "Dataset Curation", "Instruction Tuning", "Train-Test Splits"]
  },
  {
    day: 15,
    module: "Module 4: LLM Core, Prompting & Fine-Tuning",
    topic: "Fine-Tuning: Hands-On with LoRA & QLoRA",
    title: "Fine-Tuning: Hands-On with LoRA & QLoRA",
    type: "SHIP_IT",
    description: "Hands-on parameter-efficient fine-tuning using LoRA, BitsAndBytes 4-bit QLoRA, and benchmark comparison.",
    learningObjectives: [
      "Train or fine-tune an LLM using LoRA or the OpenAI fine-tuning workflow",
      "Load and evaluate the fine-tuned model",
      "Compare the base model and fine-tuned model on unseen test cases",
      "Measure improvements in tone, consistency, and response quality",
      "Document whether fine-tuning provides measurable benefits for the chatbot"
    ],
    objectives: [
      "Train or fine-tune an LLM using LoRA or the OpenAI fine-tuning workflow",
      "Load and evaluate the fine-tuned model",
      "Compare the base model and fine-tuned model on unseen test cases",
      "Measure improvements in tone, consistency, and response quality",
      "Document whether fine-tuning provides measurable benefits for the chatbot"
    ],
    tools: ["PEFT", "Transformers", "BitsAndBytes", "OpenAI Fine-Tuning", "LoRA"],
    difficulty: "Intermediate",
    keyConcepts: ["LoRA Adapters", "QLoRA 4-bit", "PEFT Training", "Model Evaluation"]
  },
  {
    day: 16,
    module: "Module 5: Chatbot Application Build",
    topic: "Chatbot Backend & API Integration",
    title: "Chatbot Backend & API Integration",
    type: "BUILD",
    description: "Build robust FastAPI /chat endpoints integrating retrieval routers, function execution, and session history.",
    learningObjectives: [
      "Create a /chat API endpoint for the healthcare chatbot",
      "Integrate retrieval, function calling, and LLM response generation",
      "Implement session-based conversation management",
      "Build a conversation history endpoint",
      "Test the complete backend API using Postman or cURL"
    ],
    objectives: [
      "Create a /chat API endpoint for the healthcare chatbot",
      "Integrate retrieval, function calling, and LLM response generation",
      "Implement session-based conversation management",
      "Build a conversation history endpoint",
      "Test the complete backend API using Postman or cURL"
    ],
    tools: ["FastAPI", "SQLite", "Python"],
    difficulty: "Intermediate",
    keyConcepts: ["FastAPI Chat Endpoint", "Session History", "API Routing", "Backend Integration"]
  },
  {
    day: 17,
    module: "Module 5: Chatbot Application Build",
    topic: "Chatbot Frontend Development",
    title: "Chatbot Frontend Development",
    type: "BUILD",
    description: "Develop responsive Streamlit / React chat interfaces with session selection, context switches, and new chat resets.",
    learningObjectives: [
      "Build an interactive chat interface for the chatbot",
      "Connect the frontend to the backend chat API",
      "Maintain conversation history across user interactions",
      "Add a healthcare plan selector and new conversation option",
      "Validate end-to-end communication between frontend and backend"
    ],
    objectives: [
      "Build an interactive chat interface for the chatbot",
      "Connect the frontend to the backend chat API",
      "Maintain conversation history across user interactions",
      "Add a healthcare plan selector and new conversation option",
      "Validate end-to-end communication between frontend and backend"
    ],
    tools: ["Streamlit", "Requests", "UUID"],
    difficulty: "Intermediate",
    keyConcepts: ["Chatbot UI", "Streamlit Frontend", "Session Management", "API Request Handling"]
  },
  {
    day: 18,
    module: "Module 5: Chatbot Application Build",
    topic: "Full-Stack Integration & Streaming Responses",
    title: "Full-Stack Integration & Streaming Responses",
    type: "BUILD",
    description: "Real-time token streaming with Server-Sent Events (SSE), loading states, and exception handling.",
    learningObjectives: [
      "Implement real-time streaming responses from the LLM",
      "Display generated tokens incrementally in the chat interface",
      "Add loading indicators for a better user experience",
      "Handle interrupted or failed streaming requests gracefully",
      "Verify smooth end-to-end streaming between backend and frontend"
    ],
    objectives: [
      "Implement real-time streaming responses from the LLM",
      "Display generated tokens incrementally in the chat interface",
      "Add loading indicators for a better user experience",
      "Handle interrupted or failed streaming requests gracefully",
      "Verify smooth end-to-end streaming between backend and frontend"
    ],
    tools: ["FastAPI", "StreamingResponse", "Server-Sent Events", "Streamlit"],
    difficulty: "Intermediate",
    keyConcepts: ["SSE Streaming", "Incremental Tokens", "StreamingResponse", "UI Loading States"]
  },
  {
    day: 19,
    module: "Module 5: Chatbot Application Build",
    topic: "Response Formatting & Rich Outputs",
    title: "Response Formatting & Rich Outputs",
    type: "BUILD",
    description: "Format responses with source citations, Markdown tables, summary cards, and Pydantic validation.",
    learningObjectives: [
      "Add citations to chatbot responses using retrieved knowledge",
      "Create structured cards for claims and coverage summaries",
      "Render Markdown content with tables, lists, and formatting",
      "Validate structured outputs before displaying them",
      "Improve chatbot readability and response trustworthiness"
    ],
    objectives: [
      "Add citations to chatbot responses using retrieved knowledge",
      "Create structured cards for claims and coverage summaries",
      "Render Markdown content with tables, lists, and formatting",
      "Validate structured outputs before displaying them",
      "Improve chatbot readability and response trustworthiness"
    ],
    tools: ["Pydantic", "Markdown", "Streamlit"],
    difficulty: "Intermediate",
    keyConcepts: ["Source Citations", "Markdown Rendering", "Structured UI Cards", "Output Formatting"]
  },
  {
    day: 20,
    module: "Module 5: Chatbot Application Build",
    topic: "Conversation Memory & Context Management",
    title: "Conversation Memory & Context Management",
    type: "SHIP_IT",
    description: "Persist session states, sliding window conversation buffers, token budget truncation, and chat summarization.",
    learningObjectives: [
      "Persist conversation history across multiple user sessions",
      "Build context-aware conversations using previous messages",
      "Implement automatic conversation summarization for long chats",
      "Manage token limits while preserving important context",
      "Ensure the chatbot remembers user preferences throughout a conversation"
    ],
    objectives: [
      "Persist conversation history across multiple user sessions",
      "Build context-aware conversations using previous messages",
      "Implement automatic conversation summarization for long chats",
      "Manage token limits while preserving important context",
      "Ensure the chatbot remembers user preferences throughout a conversation"
    ],
    tools: ["SQLite", "FastAPI", "LLM", "Token Management"],
    difficulty: "Intermediate",
    keyConcepts: ["Conversation Memory", "Token Window Truncation", "Context Summarization", "State Persistence"]
  },
  {
    day: 21,
    module: "Module 6: Agentic AI & MCP",
    topic: "Agentic Frameworks: LangChain Agents & Tool Use",
    title: "Agentic Frameworks: LangChain Agents & Tool Use",
    type: "BUILD",
    description: "ReAct reasoning loops, converting function calls into autonomous agents, and tool trace inspection.",
    learningObjectives: [
      "Convert function-calling workflows into a reasoning agent",
      "Wrap chatbot capabilities as reusable LangChain tools",
      "Build a ReAct agent capable of selecting the correct tool automatically",
      "Analyze reasoning traces to understand agent decision making",
      "Evaluate whether the agent chooses the right tools for healthcare queries"
    ],
    objectives: [
      "Convert function-calling workflows into a reasoning agent",
      "Wrap chatbot capabilities as reusable LangChain tools",
      "Build a ReAct agent capable of selecting the correct tool automatically",
      "Analyze reasoning traces to understand agent decision making",
      "Evaluate whether the agent chooses the right tools for healthcare queries"
    ],
    tools: ["LangChain", "LangChain Agents", "ReAct", "Python"],
    difficulty: "Advanced",
    keyConcepts: ["ReAct Agents", "LangChain Tools", "Reasoning Traces", "Tool Selection"]
  },
  {
    day: 22,
    module: "Module 6: Agentic AI & MCP",
    topic: "Multi-Agent Orchestration",
    title: "Multi-Agent Orchestration",
    type: "BUILD",
    description: "Architect specialized domain agents orchestrated by router supervisors using CrewAI and LangGraph state graphs.",
    learningObjectives: [
      "Create specialized agents for different healthcare domains",
      "Build a router agent that delegates requests to the correct specialist",
      "Implement a complete multi-agent workflow",
      "Compare multi-agent performance with a single-agent architecture",
      "Identify scenarios where multiple agents provide measurable benefits"
    ],
    objectives: [
      "Create specialized agents for different healthcare domains",
      "Build a router agent that delegates requests to the correct specialist",
      "Implement a complete multi-agent workflow",
      "Compare multi-agent performance with a single-agent architecture",
      "Identify scenarios where multiple agents provide measurable benefits"
    ],
    tools: ["CrewAI", "LangGraph", "Python"],
    difficulty: "Advanced",
    keyConcepts: ["Multi-Agent System", "LangGraph State Graphs", "CrewAI", "Router Agent"]
  },
  {
    day: 23,
    module: "Module 6: Agentic AI & MCP",
    topic: "Model Context Protocol (MCP)",
    title: "Model Context Protocol (MCP)",
    type: "BUILD",
    description: "Expose enterprise tools and resources using the Model Context Protocol (MCP) Python SDK and host client connections.",
    learningObjectives: [
      "Understand the purpose of the Model Context Protocol",
      "Build an MCP server exposing healthcare chatbot tools",
      "Connect the MCP server to an MCP-compatible client",
      "Expose multiple chatbot capabilities through standardized MCP tools",
      "Verify successful tool execution through live MCP interactions"
    ],
    objectives: [
      "Understand the purpose of the Model Context Protocol",
      "Build an MCP server exposing healthcare chatbot tools",
      "Connect the MCP server to an MCP-compatible client",
      "Expose multiple chatbot capabilities through standardized MCP tools",
      "Verify successful tool execution through live MCP interactions"
    ],
    tools: ["MCP Python SDK", "Claude Desktop", "Cline", "Python"],
    difficulty: "Advanced",
    keyConcepts: ["Model Context Protocol (MCP)", "MCP Resources", "MCP Tools", "JSON-RPC Standard"]
  },
  {
    day: 24,
    module: "Module 6: Agentic AI & MCP",
    topic: "Agentic Chatbot Integration",
    title: "Agentic Chatbot Integration",
    type: "SHIP_IT",
    description: "Combine agents, live MCP tool endpoints, RAG retrieval, and resilient error recovery pipelines.",
    learningObjectives: [
      "Integrate agents, MCP tools, retrieval, and conversation memory",
      "Replace mock tools with live MCP-powered tool calls",
      "Implement retries, timeouts, and graceful error handling",
      "Perform failure testing to validate chatbot reliability",
      "Build a production-style agentic chatbot pipeline"
    ],
    objectives: [
      "Integrate agents, MCP tools, retrieval, and conversation memory",
      "Replace mock tools with live MCP-powered tool calls",
      "Implement retries, timeouts, and graceful error handling",
      "Perform failure testing to validate chatbot reliability",
      "Build a production-style agentic chatbot pipeline"
    ],
    tools: ["LangChain", "MCP", "FastAPI", "Python"],
    difficulty: "Advanced",
    keyConcepts: ["Agentic Integration", "MCP Tool Execution", "Resilience & Retries", "Production Agent"]
  },
  {
    day: 25,
    module: "Module 7: Evaluation, Security & Deployment",
    topic: "Chatbot Evaluation & Testing",
    title: "Chatbot Evaluation & Testing",
    type: "SHIP_IT",
    description: "Construct evaluation benchmarks, measure RAG grounding metrics, and run automated regression tests.",
    learningObjectives: [
      "Create a benchmark dataset covering representative healthcare questions",
      "Evaluate chatbot responses for accuracy, grounding, and consistency",
      "Measure retrieval quality and end-to-end response performance",
      "Identify common failure cases and document improvement areas",
      "Establish baseline metrics before production deployment"
    ],
    objectives: [
      "Create a benchmark dataset covering representative healthcare questions",
      "Evaluate chatbot responses for accuracy, grounding, and consistency",
      "Measure retrieval quality and end-to-end response performance",
      "Identify common failure cases and document improvement areas",
      "Establish baseline metrics before production deployment"
    ],
    tools: ["Python", "Evaluation Dataset", "Automated Testing"],
    difficulty: "Advanced",
    keyConcepts: ["Benchmark Datasets", "Grounding Evaluation", "RAG Metrics", "Automated Regression"]
  },
  {
    day: 26,
    module: "Module 7: Evaluation, Security & Deployment",
    topic: "Performance Optimization & Cost Management",
    title: "Performance Optimization & Cost Management",
    type: "OPTIMIZE",
    description: "Measure token budgets with Tiktoken, response caching, prompt optimization, and latency reduction.",
    learningObjectives: [
      "Measure token usage across the chatbot pipeline",
      "Optimize retrieval and prompt size to reduce latency and cost",
      "Implement response caching for repeated queries",
      "Benchmark response time before and after optimization",
      "Document performance improvements using measurable metrics"
    ],
    objectives: [
      "Measure token usage across the chatbot pipeline",
      "Optimize retrieval and prompt size to reduce latency and cost",
      "Implement response caching for repeated queries",
      "Benchmark response time before and after optimization",
      "Document performance improvements using measurable metrics"
    ],
    tools: ["tiktoken", "Python", "FastAPI"],
    difficulty: "Advanced",
    keyConcepts: ["Token Cost Optimization", "Semantic Caching", "Tiktoken Budgeting", "Latency Reduction"]
  },
  {
    day: 27,
    module: "Module 7: Evaluation, Security & Deployment",
    topic: "Security, Privacy & Guardrails",
    title: "Security, Privacy & Guardrails",
    type: "BUILD",
    description: "Input sanitization, protection against prompt injections, API key security, and sensitive data guardrails.",
    learningObjectives: [
      "Secure chatbot APIs against unauthorized access",
      "Validate and sanitize user inputs before processing",
      "Protect sensitive healthcare information throughout the pipeline",
      "Implement prompt-injection and jailbreak safeguards",
      "Test common security scenarios and document mitigation strategies"
    ],
    objectives: [
      "Secure chatbot APIs against unauthorized access",
      "Validate and sanitize user inputs before processing",
      "Protect sensitive healthcare information throughout the pipeline",
      "Implement prompt-injection and jailbreak safeguards",
      "Test common security scenarios and document mitigation strategies"
    ],
    tools: ["FastAPI", "Python", "Authentication", "Input Validation"],
    difficulty: "Advanced",
    keyConcepts: ["Prompt Injection Defense", "Guardrail Filters", "Input Sanitization", "API Protection"]
  },
  {
    day: 28,
    module: "Module 7: Evaluation, Security & Deployment",
    topic: "Docker & Kubernetes Deployment",
    title: "Docker & Kubernetes Deployment",
    type: "SHIP_IT",
    description: "Containerize multi-container services with Dockerfiles and deploy to Kubernetes clusters with health probes.",
    learningObjectives: [
      "Containerize the chatbot backend and frontend using Docker",
      "Deploy the application to a Kubernetes cluster",
      "Configure health checks and environment variables",
      "Verify the deployed chatbot functions correctly",
      "Prepare the application for production hosting"
    ],
    objectives: [
      "Containerize the chatbot backend and frontend using Docker",
      "Deploy the application to a Kubernetes cluster",
      "Configure health checks and environment variables",
      "Verify the deployed chatbot functions correctly",
      "Prepare the application for production hosting"
    ],
    tools: ["Docker", "Kubernetes", "FastAPI", "React"],
    difficulty: "Advanced",
    keyConcepts: ["Docker Containerization", "Kubernetes Deployments", "Health Probes", "K8s Services"]
  },
  {
    day: 29,
    module: "Module 8: Production & Capstone",
    topic: "Monitoring, Logging & Observability",
    title: "Monitoring, Logging & Observability",
    type: "BUILD",
    description: "Implement structured logging, Prometheus metrics, and Grafana observability dashboards for LLM backends.",
    learningObjectives: [
      "Add structured logging throughout the chatbot pipeline",
      "Monitor API performance and chatbot usage",
      "Track failures, latency, and tool execution metrics",
      "Build dashboards for production observability",
      "Use monitoring insights to improve chatbot reliability"
    ],
    objectives: [
      "Add structured logging throughout the chatbot pipeline",
      "Monitor API performance and chatbot usage",
      "Track failures, latency, and tool execution metrics",
      "Build dashboards for production observability",
      "Use monitoring insights to improve chatbot reliability"
    ],
    tools: ["Python Logging", "Prometheus", "Grafana"],
    difficulty: "Advanced",
    keyConcepts: ["Structured Logging", "Prometheus Metrics", "Grafana Dashboards", "LLM Observability"]
  },
  {
    day: 30,
    module: "Module 8: Production & Capstone",
    topic: "Production Readiness & Final Testing",
    title: "Production Readiness & Final Testing",
    type: "SHIP_IT",
    description: "End-to-end integration validation across retrieval, agents, UI streaming, and operational documentation.",
    learningObjectives: [
      "Perform complete end-to-end testing of the chatbot",
      "Validate retrieval, agent workflows, and frontend integration",
      "Fix production issues discovered during testing",
      "Complete deployment and operational documentation",
      "Prepare the chatbot for real-world production usage"
    ],
    objectives: [
      "Perform complete end-to-end testing of the chatbot",
      "Validate retrieval, agent workflows, and frontend integration",
      "Fix production issues discovered during testing",
      "Complete deployment and operational documentation",
      "Prepare the chatbot for real-world production usage"
    ],
    tools: ["FastAPI", "Docker", "Kubernetes", "Python"],
    difficulty: "Advanced",
    keyConcepts: ["Production Readiness", "E2E Testing", "Operational Runbooks", "System Validation"]
  },
  {
    day: 31,
    module: "Module 8: Production & Capstone",
    topic: "Capstone Project & Final Demo",
    title: "Capstone Project & Final Demo",
    type: "CAPSTONE",
    description: "Demonstrate the complete enterprise healthcare AI assistant showcasing RAG, Agents, MCP, memory, and container deployment.",
    learningObjectives: [
      "Demonstrate the complete enterprise healthcare chatbot",
      "Showcase retrieval, RAG, agents, MCP, and conversation memory",
      "Present the deployed application with production architecture",
      "Evaluate the chatbot using real-world scenarios",
      "Publish the final project with source code and documentation"
    ],
    objectives: [
      "Demonstrate the complete enterprise healthcare chatbot",
      "Showcase retrieval, RAG, agents, MCP, and conversation memory",
      "Present the deployed application with production architecture",
      "Evaluate the chatbot using real-world scenarios",
      "Publish the final project with source code and documentation"
    ],
    tools: ["FastAPI", "React", "LangChain", "MCP", "Docker", "Kubernetes"],
    difficulty: "Advanced",
    keyConcepts: ["Capstone Showcase", "Enterprise Architecture", "RAG & Agents Demo", "Final Defense"]
  }
];
