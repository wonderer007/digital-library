# Digital Library

A digital library project built with React, TypeScript, and Vite that allows users to fetch books, manage their personal library, and analyze texts using AI.

## Features

- 📚 Search and fetch books from Gutenberg
- 📖 Read books directly in the application
- ⭐ Add books to your personal library
- 🤖 AI-powered text analysis and insights
- 📱 Responsive design for desktop and mobile

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn package manager
- Supabase account

## Supabase Setup
### CLI Installation
1. [Install the Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
2. Run `supabase login`

### Database Migration
```bash
npx supabase db push --db-url postgres://postgres.[YOUR-PROJECT-ID]:[YOUR-DATABASE-PASSWORD]@aws-0-[YOUR-AWS-REGION].pooler.supabase.com:6543/postgres
```
This will create database structure in your supabase using `supabase/migrations/`

### Edge Functions
The `supabase/functions` directory contains the following edge functions that need to be deployed:
```bash
supabase functions deploy search_book
supabase functions deploy fetch_book_content
supabase functions deploy text_analysis
```

### Environment Setup
1. Add `GROK_API_TOKEN` to the Edge Function Secrets Management in your Supabase dashboard

## Project Setup

1. Clone the repository:
   ```bash
   git clone git@github.com:wonderer007/digital-library.git
   cd digital-library
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Configure environment variables:
   Create a `.env` file in the project root with the following variables:
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Available Scripts

### Development Server
```bash
npm run dev
# or
yarn dev
```
Opens the development server at `http://localhost:5173`

### Testing
```bash
npm run test
# or
yarn test
```

