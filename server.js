const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

// Connect Databse
connectDB();

const app = express();
app.use(express.json());

// Define Routes
const auth = require("./routes/api/auth");
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/posts", posts);

// Serve static  asets in production
if(process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});