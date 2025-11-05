---
title: I Built a Local Dev Tool for ChatGPT Apps SDK
date: 2025-11-05
tags:
    - ChatGPT
    - OpenAI
    - Developer Tools
    - MCP
    - React
categories:
    - Development Tools
    - AI Development
keywords:
    - ChatGPT Apps SDK
    - Model Context Protocol
    - MCP Components
    - OpenAI Development
    - Component Development
    - Local Development Tool
    - ChatGPT Custom UI
---

When OpenAI released the **Apps SDK**, I was really excited.
It finally allowed developers to build **custom UI components** inside ChatGPT, a big step toward making ChatGPT more like a real app platform.

So I tried it on day one.
And getting it to work, I quickly realized that testing these apps locally wasn’t easy.

## The Developer Experience Today

To develop a simple App for ChatGPT, you currently need to:

* Have a **paid ChatGPT account**
* Run a local **MCP server**
* Expose it using **ngrok** (or another tunnel)
* Serve bundled component with proper **Content Security Policy (CSP)**

Even then, you can run into issues like tools not working or ChatGPT not loading your resources correctly.
It felt like too much setup just to preview a button click or test a small UI change.

## The Idea: Mock the ChatGPT Environment Locally

While debugging, I realized that ChatGPT just talks to apps through a **JavaScript API** — `window.openai`.
That’s the bridge used by all ChatGPT Apps and MCP components.

So I thought,

> “What if I just mock that API locally?”

If I can simulate `window.openai.callTool()`, `getWidgetState()`, and the rest,
I could preview components in a local sandbox that behaves just like ChatGPT
without running a real MCP server or using ChatGPT at all.

## The Result: A Storybook-Like IDE for ChatGPT Components

I built a **local development tool** that does exactly that.
It’s a **Storybook-style IDE** for developing and testing ChatGPT MCP components — completely offline.

![Component Preview Screenshot](https://res.cloudinary.com/journalapp/image/upload/v1762364992/component-development-tool-for-chatgpt-app-sdk-v0-wclnjfh8l9zf1_te08ut.webp)

## ✨ Features

* 🎨 **React + Vite + TypeScript** with hot reload
* 🔍 **Monaco-based JSON editor** for mock data
* 🎭 **Sandboxed ChatGPT-like preview** inside an iframe
* 🌐 Full **`window.openai` mock API** (tool calls, state, etc.)
* 💾 **Widget state simulation** using IndexedDB
* 📦 **Export production-ready bundles (HTML/CSS/JS)** using **esbuild**
* 🧩 **Component templates** for faster starts (List Card, Map Card, Carousel, etc.)


## How It Works

Each component lives in its own folder:

```
components/
  my-widget/
    ├── manifest.json
    ├── component.tsx
    └── mocks/
        ├── default.json
        ├── empty.json
        └── loading.json
```

When you open the dev tool, it loads your component inside a sandboxed iframe.
A small bridge script fakes the ChatGPT runtime by injecting a mock `window.openai` object:

```ts
window.openai = {
  callTool: async (name, args) => postMessage({ type: 'call', name, args }),
  getWidgetState: async (id) => db.get(id),
  setWidgetState: async (id, state) => db.put(id, state),
  openExternal: (url) => window.open(url, '_blank', 'noopener,noreferrer'),
  requestDisplayMode: async (mode) => postMessage({ type: 'displayMode', mode }),
  sendFollowUpMessage: async (message) => postMessage({ type: 'followup', message })
};
```

From your component’s point of view, it’s running inside ChatGPT.
You can call tools, update state, and see real-time results — no tunnel required.

## Quick Templates for Faster Start

![Template Selector Screenshot](https://res.cloudinary.com/journalapp/image/upload/v1762364991/component-development-tool-for-chatgpt-app-sdk-v0-h9hs6ze9o9zf1_jhftmy.webp)

You don’t have to start from scratch.
The tool includes ready-to-use templates like:

- List Card
- Map Card
- Image Carousel
- Grid Layout
- Blank Canvas

Click "New Component" pick a template, and get a scaffolded setup with mock data in seconds.


## Simulating Tool Calls and Flows

![Tool Routing Screenshot](https://res.cloudinary.com/journalapp/image/upload/v1762364992/component-development-tool-for-chatgpt-app-sdk-v0-5rznw9oml9zf1_uzvm3a.webp)

You can even simulate **tool switching** — for example, how one component triggers another when calling `window.openai.callTool()`.

Define simple “tool routing rules” inside the app and test multi-step flows locally.

## Why I Built It

ChatGPT Apps are powerful — but the current SDK still makes simple experiments slow.
I wanted a way for frontend developers to **just start building**, without setup pain or dependency on the ChatGPT UI.

This tool makes local prototyping easy, fast, and open for everyone — no tunnels, no accounts, no waiting.

## Try It Yourself

**GitHub:** [https://github.com/itsnikhil/oai-app-composer](https://github.com/itsnikhil/oai-app-composer)

```bash
npm install
npm run dev
# then open http://localhost:3000
```

You’ll see a sidebar with components and a live ChatGPT-like preview on the right.
Edit mock data, change your UI, and see results instantly.

## Final Thoughts

The OpenAI Apps SDK is a huge step forward — but it’s still early.
Tools like this can make the developer experience smoother and help more people build quality apps.

If you’re exploring ChatGPT Apps SDK, give it a try.

**Built with ❤️ for the ChatGPT developer community**
