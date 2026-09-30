const inputText = document.getElementById("inputText");
const charCount = document.getElementById("charCount");
const lengthSelect = document.getElementById("length");
const summarizeBtn = document.getElementById("summarizeBtn");
const errorBox = document.getElementById("errorBox");
const resultBox = document.getElementById("resultBox");
const summaryOutput = document.getElementById("summaryOutput");
const copyBtn = document.getElementById("copyBtn");

inputText.addEventListener("input", () => {
  charCount.textContent = inputText.value.length;
});

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function clearError() {
  errorBox.classList.add("hidden");
  errorBox.textContent = "";
}

summarizeBtn.addEventListener("click", async () => {
  const text = inputText.value.trim();
  clearError();
  resultBox.classList.add("hidden");

  if (text.length < 40) {
    showError("Please paste at least a few sentences of text to summarize.");
    return;
  }

  summarizeBtn.disabled = true;
  summarizeBtn.textContent = "Summarizing...";

  try {
    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        length: lengthSelect.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong. Please try again.");
    }

    summaryOutput.textContent = data.summary;
    resultBox.classList.remove("hidden");
  } catch (err) {
    showError(err.message);
  } finally {
    summarizeBtn.disabled = false;
    summarizeBtn.textContent = "Summarize";
  }
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(summaryOutput.textContent).then(() => {
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy summary"), 1500);
  });
});
