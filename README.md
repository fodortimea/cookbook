
# Cook Book App

## Overview

This Cook Book App helps users find recipes based on ingredients, partial names, or search criteria context and images. It uses a custom Ollama model based on llava-llama3 for generating detailed and persuasive descriptions.

## Tech Stack
- **Next.js**: Framework for building the web application.
- **Supabase**: Database.
- **Ollama**: Embedding generation, text generation, image recognition.

## Prerequisites

- **Node.js (v18.18 or later)**
- **Supabase account**
- **Ollama running locally** with the custom llava-llama model

## Setup and Installation

### Set up the LLM Models
#### **Pull the all-minilm embedding model**
In a terminal run 
```
ollama run all-minilm
```
#### **Create a Specific llava-llama3 Multimodal Model**
In a terminal run 
```
ollama run llava-llama3
```
Specify the system prompt to your preferences and save it as `foodie`.

### Install Dependencies

```
npm install
```
### Create the Database
1. Create a new project in Supabase.
2. Open the Supabase SQL Editor, and paste the content of `setup.sql` from this repository into it.
3. Run the script.

### 3. Configure Environment Variables

1. In the root directory of your project, create a `.env.local` file.
2. Add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=your-anon-key
```

Replace `your-project-url.supabase.co` with your Supabase Project URL.
Replace `your-anon-key` with your Supabase anon public API key.

### Run the App

```
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

