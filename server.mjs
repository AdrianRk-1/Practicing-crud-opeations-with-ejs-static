import express from "express";

import { fileURLToPath } from "url";
import path from "path";

import productRoute from "./routes/productsRoute.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static(path.join(__dirname, "./public")));

app.use("/products", productRoute);

app.use((req, res) => {
  res.status(404).json({ error: "Path does not exist" });
});

app.listen(3000);
