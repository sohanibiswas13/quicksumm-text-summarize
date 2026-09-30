# QuickSumm — AI Text Summarizer

QuickSumm is a simple Generative AI web app that summarizes long text (articles, notes, essays) into a short, easy-to-read summary. The user pastes text, picks a summary length (short / medium / detailed), and the app calls a Large Language Model (OpenAI's `gpt-4o-mini`) to generate the summary.

## How it works

1. The frontend (`public/`) is a plain HTML/CSS/JS page — no framework needed.
2. When the user clicks **Summarize**, the page sends the text to a backend API route (`api/summarize.js`).
3. That serverless function calls the OpenAI API with a prompt instructing it to summarize only the given text (no invented facts) at the requested length.
4. The summary is returned as JSON and displayed on the page.

## Tech stack

| Tool | Purpose |
|---|---|
| HTML/CSS/JavaScript | Frontend UI |
| Vercel Serverless Functions (Node.js) | Backend API that calls the AI model |
| OpenAI API (`gpt-4o-mini`) | Generates the summary |

## Project structure

```
text-summarizer/
├── api/
│   └── summarize.js     # Backend serverless function (calls OpenAI)
├── public/
│   ├── index.html        # Main page
│   ├── style.css         # Styling
│   └── script.js         # Frontend logic
├── .env.example           # Template for your API key (do not commit real keys)
├── .gitignore
├── package.json
└── README.md
```

## Run it locally

1. **Install the Vercel CLI** (used to run the serverless function locally):
   ```bash
   npm install -g vercel
   ```

2. **Add your API key.** Copy `.env.example` to `.env.local` and paste your OpenAI key:
   ```bash
   cp .env.example .env.local
   ```
   Get a key from https://platform.openai.com/api-keys

3. **Run the dev server:**
   ```bash
   vercel dev
   ```
   Open the local URL it prints (usually `http://localhost:3000`).

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: QuickSumm text summarizer"
git branch -M main
git remote add origin https://github.com/<your-username>/quicksumm.git
git push -u origin main
```

> Make sure `.env.local` is never committed — it's already excluded in `.gitignore`.

## Deploy to Vercel (free hosting)

1. Go to https://vercel.com and sign in with your GitHub account.
2. Click **Add New → Project**, then import your `quicksumm` repository.
3. In **Environment Variables**, add:
   - Key: `OPENAI_API_KEY`
   - Value: your actual OpenAI API key
4. Click **Deploy**. Vercel will give you a live URL like `https://quicksumm-yourname.vercel.app`.

That live URL is what you submit as your **Hosted Project Link**.

## Notes

- If you don't have an OpenAI key, this same code works with any chat-completions-compatible API (e.g., Groq, which has a generous free tier) — just change the `fetch` URL and model name in `api/summarize.js`.
- No user data is stored; each request is stateless.
