const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 8080;

// Middleware for JSON request and response
app.use(express.json());

// Middleware for enabling CORS requests from PORT 3000
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Example RESTful endpoint
app.get("/", (req, res) => {
  res.send({
    message: "Setting up NodeJS backend.",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
