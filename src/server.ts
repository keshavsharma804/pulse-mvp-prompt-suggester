import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { generateSuggestions } from "./suggestor";

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/suggest", (req, res) => {
  const { context } = req.body;
  if (!context) return res.status(400).json({ error: "context required" });
  const suggestions = generateSuggestions(context);
  res.json({ suggestions });
});

// endpoint to "run" a suggestion (mocked)
app.post("/api/run", (req, res) => {
  const { suggestionId, context } = req.body;
  // For MVP, just return the suggestion.sampleOutput from generator
  const s = generateSuggestions(context).find(x => x.id === suggestionId);
  if (!s) return res.status(404).json({ error: "suggestion not found" });
  // In real system, call model here with s.promptTemplate
  res.json({ output: s.sampleOutput });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
