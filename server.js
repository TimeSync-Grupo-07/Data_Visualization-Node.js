import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "app")));

// Endpoint que retorna config dinâmica
app.get("/env.js", (req, res) => {
  res.type("application/javascript");
  res.send(`window.ENV = { API_BASE_URL: "${process.env.API_BASE_URL}" };`);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "app", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Front-end rodando na porta ${PORT}`);
});
