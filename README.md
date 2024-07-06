
# Cook Book App

## Overview

This Cook bBook App helps users find recipes based on ingredients, partial names, or images. It uses a custom Ollama model based on llava-llama3 for generating detailed and persuasive descriptions.

## Tech Stack
- **Next.js**: Framework for building the web application.
- **Supabase**: Database & Edge Functions.
- **Ollama**: Embedding generation, text generation, image recognition.

## Prerequisites

- **Node.js (v18.18 or later)**
- **Ollama running locally** with the custom llava-llama model

## Setup and Installation

### Install Dependencies

```
npm install
```


### Create a Specific llava-llama3 Model

Create a model based on llava-llama3 named as `foodie`. Specify the system prompt how you see it fit.

### Run the App

```
npm run dev
```

- Open your browser and navigate to `http://localhost:3000`.

