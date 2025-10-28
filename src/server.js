import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 🔁 Proxy: tudo que começa com /api vai para o Nginx (10.0.1.76)
app.use('/api', createProxyMiddleware({
  target: 'http://10.0.1.76/api', // Load Balancer Nginx
  changeOrigin: true,
}));

// Servir o frontend
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Frontend disponível em http://localhost:${PORT}`);
});
