# ✨ Prompt Enhancer (Pretty Prompt Clone)

An enterprise-grade, meta-prompting application that transforms rough ideas into professional, high-quality LLM prompts. Built with **Next.js 14**, **Material UI v5**, and **OpenAI/Anthropic** integration.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![Coverage](https://img.shields.io/badge/Coverage-91%25-brightgreen)

## 🚀 Features

- **Improve Mode** ⚡: One-click enhancement using advanced meta-prompting techniques.
- **Refine Mode** 🔍: Interactive two-step process that asks clarifying questions to tailor the prompt perfectly to your needs.
- **Multi-LLM Support** 🤖: Switch seamlessly between **OpenAI** (GPT-4o) and **Anthropic** (Claude 3).
- **Enterprise Architecture** 🏗️: Clean, layered code structure separating core logic, infrastructure, and UI.
- **Dark Mode UI** 🌙: Premium glassmorphism design system using Material UI.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 App Router
- **Language**: TypeScript
- **Styling**: Material UI v5 (Emotion)
- **AI Integration**: OpenAI SDK, Anthropic SDK
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- API Key via [OpenAI](https://platform.openai.com/) or [Anthropic](https://console.anthropic.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/prompt-enhancer.git
   cd prompt-enhancer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Wrapper the example env file:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your API keys:
   ```env
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   DEFAULT_LLM_PROVIDER=openai
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Running Tests

This project maintains high test coverage (>90%).

- **Run Unit & Integration Tests:**
  ```bash
  npm test
  ```
- **Check Coverage:**
  ```bash
  npm run test:coverage
  ```

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router & API Endpoints
├── components/           # UI Components (Atomic Design)
├── core/                 # Business Logic & LLM Services
├── infrastructure/       # Config & Environment
├── shared/               # Utilities, Hooks, Types
└── theme/                # Global Design System
```

## 🔧 Configuration

You can customize the LLM models and UI constants in `src/infrastructure/config/constants.ts`:

```typescript
export const LLM_CONFIG = {
    openai: {
        model: 'gpt-4o-mini',
        // ...
    }
}
```

## 📄 License

This project is licensed under the MIT License.
