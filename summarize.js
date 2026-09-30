// api/summarize.js
// Serverless function (Vercel). Receives text + desired length,
// calls the OpenAI API, and returns a generated summary.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  const { text, length } = req.body || {};

  if (!text || typeof text !== "string" || text.trim().length < 40) {
    return res.status(400).json({ error: "Please provide at least a few sentences of text." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Server is missing OPENAI_API_KEY. Add it in your Vercel project's Environment Variables.",
    });
  }

  const lengthInstructions = {
    short: "Summarize the text in 2-3 concise sentences, capturing only the most important point.",
    medium: "Summarize the text in a single, well-written paragraph (roughly 4-6 sentences).",
    detailed: "Summarize the text in 2-3 short paragraphs, preserving all key points, names, and figures.",
  };

  const instruction = lengthInstructions[length] || lengthInstructions.medium;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a precise summarization assistant. You only summarize the text you are given. You never add facts, opinions, or information that is not present in the source text.",
          },
          {
            role: "user",
            content: `${instruction}\n\nText to summarize:\n"""\n${text}\n"""`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errData.error?.message || "The AI provider returned an error.",
      });
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content?.trim();

    if (!summary) {
      return res.status(500).json({ error: "No summary was returned. Please try again." });
    }

    return res.status(200).json({ summary });
  } catch (err) {
    return res.status(500).json({ error: "Failed to reach the AI provider. Please try again." });
  }
}
