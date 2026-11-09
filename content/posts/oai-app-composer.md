---
title: I Built a Local Dev Tool for ChatGPT Apps SDK
date: 2025-11-05
lastmod: 2026-11-09
description: A local prototyping tool for ChatGPT Apps SDK components, with mock tool calls, widget state and starter MCP server code.
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

## The Setup I Wanted to Avoid

<span id="the-developer-experience-today"></span>

When I started experimenting with the SDK in late 2025, testing a simple app inside ChatGPT involved:

* Having access to **ChatGPT developer mode**
* Running a local **MCP server**
* Exposing it using **ngrok** (or another tunnel)
* Serving a bundled component with proper **Content Security Policy (CSP)**

Even then, you can run into issues like tools not working or ChatGPT not loading your resources correctly.
It felt like too much setup just to preview a button click or test a small UI change.

## The Idea: Mock the ChatGPT Environment Locally

The Apps SDK components I was building used `window.openai` as the bridge to their ChatGPT host.

So I thought,

> “What if I just mock that API locally?”

If I can simulate `window.openai.callTool()`, `widgetState`, and `setWidgetState()`,
I could preview components in a local sandbox that simulates the interactions I wanted to test
without running a real MCP server or using ChatGPT at all.

## The Result: A Storybook-Like IDE for ChatGPT Components

I built a **local development tool** that does exactly that.
It’s a **Storybook-style IDE** for developing and testing ChatGPT MCP components — locally with mock data, without connecting to ChatGPT.

The preview loads React, ReactDOM and Tailwind from CDNs, so it still needs network access unless those assets are made local.

![Component Preview Screenshot](https://res.cloudinary.com/journalapp/image/upload/v1762364992/component-development-tool-for-chatgpt-app-sdk-v0-wclnjfh8l9zf1_te08ut.webp)

## ✨ Features

* 🎨 **React + Vite + TypeScript** with hot reload
* 🔍 **Monaco-based JSON editor** for mock data
* 🎭 **Sandboxed ChatGPT-like preview** inside an iframe
* 🌐 Mock implementations of common **`window.openai` APIs** (tool calls, state, etc.)
* 💾 **Widget state simulation** using IndexedDB
* 📦 **Copy starter MCP server code** for deployment
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
A small bridge script injects a mock `window.openai` object. A component can then use the bridge like this:

```ts
const state = window.openai.widgetState ?? {};
window.openai.setWidgetState({ ...state, selectedId: "item-1" });
const result = await window.openai.callTool("get_items", {});
```

The local bridge routes these calls to fixtures and local state. It does not replace integration testing in ChatGPT, especially for CSP, authentication, tool behavior and host-specific UI.
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

Click "New Component", pick a template, and get a scaffolded setup with mock data in seconds.


## Simulating Tool Calls and Flows

![Tool Routing Screenshot](https://res.cloudinary.com/journalapp/image/upload/v1762364992/component-development-tool-for-chatgpt-app-sdk-v0-5rznw9oml9zf1_uzvm3a.webp)

You can even simulate **tool switching** — for example, how one component triggers another when calling `window.openai.callTool()`.

Define simple “tool routing rules” inside the app and test multi-step flows locally.

## Why I Built It

ChatGPT Apps are powerful — but the setup I encountered made simple experiments slow.
I wanted a way for frontend developers to **just start building**, without setup pain or dependency on the ChatGPT UI.

This tool makes local prototyping easy, fast, and open for everyone — no tunnels, no accounts, no waiting.

## Try It Yourself

**GitHub:** [https://github.com/itsnikhil/oai-app-composer](https://github.com/itsnikhil/oai-app-composer)

Install Git, Node.js and npm first. To reproduce the reviewed version:

```bash
git clone https://github.com/itsnikhil/oai-app-composer.git
cd oai-app-composer
git checkout d6163e3bec1a2c9b0234471ca128c7a5bd608ac5
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:3000`. Vite may choose another port if 3000 is occupied. The commands were checked against the linked source. In a separate checkout of this pinned version, dependency installation with lifecycle scripts disabled and `npm run build` both passed on Node.js 24.22.1. This verifies dependency resolution and the TypeScript/production build, not every browser interaction or ChatGPT integration.

You’ll see a sidebar with components and a live ChatGPT-like preview on the right.
Edit mock data, change your UI, and see results instantly.

## Final Thoughts

The OpenAI Apps SDK is a huge step forward — but it’s still early.
Tools like this can make the developer experience smoother and help more people build quality apps.

If you’re exploring ChatGPT Apps SDK, give it a try.

**Built with ❤️ for the ChatGPT developer community**


### Accuracy update — 9 November 2026

The descriptions above were clarified against the [November 2025 implementation](https://github.com/itsnikhil/oai-app-composer/tree/d6163e3bec1a2c9b0234471ca128c7a5bd608ac5). The preview uses CDN assets, the API bridge is a mock rather than full host parity, and export provides starter MCP server code with implementation work remaining. For current setup and API requirements, consult the [developer-mode documentation](https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-apps-in-chatgpt-beta) and [Apps SDK reference](https://developers.openai.com/plugins/reference).
