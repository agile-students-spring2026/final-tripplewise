const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Study Sync backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working"
  });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API working" });
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});