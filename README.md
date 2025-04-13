# 🚀 PodPilot – Kubernetes Pod UI + Debug Assistant

PodPilot is a developer-focused web application that provides a user-friendly interface for inspecting Kubernetes pods, viewing live logs, restarting pods, and getting GPT-based log analysis.

## Features

- 📋 View pods across all namespaces
- 📝 Stream live logs from pods
- 🔄 Restart pods with a single click
- 🤖 AI-powered log analysis using Fuelix (OpenAI-compatible)
- 📊 View pod metrics (CPU/memory usage)
- 🔍 Filter and search through logs
- 🔄 Live tail logs in real-time

## Tech Stack

- **Framework**: Next.js (Pages Router)
- **UI Components**: React
- **Styling**: CSS Modules (.module.css)
- **K8s Client**: @kubernetes/client-node
- **State Management**: Zustand
- **GPT Assistant**: Fuelix (OpenAI-compatible)
- **Deployment**: Docker / Vercel

## Prerequisites

- Node.js 18+ and npm
- Kubernetes cluster with access configured via `~/.kube/config`
- (Optional) Fuelix API key or OpenAI API key for log analysis

## Getting Started

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/podpilot.git
   cd podpilot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your configuration:
   ```
   FUELIX_API_URL=https://your-fuelix-instance.com/v1/chat/completions
   FUELIX_API_KEY=your-api-token
   DEFAULT_MODEL=gpt-3.5-turbo
   ```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build the application for production:
```bash
npm run build
npm start
```

## Docker Deployment

### Using Docker Compose

1. Make sure you have Docker and Docker Compose installed.

2. Create a `.env` file with your environment variables:
   ```
   FUELIX_API_URL=https://your-fuelix-instance.com/v1/chat/completions
   FUELIX_API_KEY=your-api-token
   DEFAULT_MODEL=gpt-3.5-turbo
   ```

3. Run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Access PodPilot at [http://localhost:3000](http://localhost:3000)

### Using Docker Directly

1. Build the Docker image:
   ```bash
   docker build -t podpilot .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 \
     -v ~/.kube/config:/root/.kube/config:ro \
     -e FUELIX_API_KEY=your-api-token \
     -e FUELIX_API_URL=https://your-fuelix-instance.com/v1/chat/completions \
     -e DEFAULT_MODEL=gpt-3.5-turbo \
     podpilot
   ```

## Usage

1. **Select a Namespace**: Choose the Kubernetes namespace from the dropdown.
2. **View Pods**: Browse the list of pods in the selected namespace.
3. **View Logs**: Click the "Logs" button to view logs for a specific pod.
4. **Restart Pod**: Click the "Restart" button to restart a pod.
5. **Analyze Logs**: Click the "Analyze" button to get AI-powered insights about the logs.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
