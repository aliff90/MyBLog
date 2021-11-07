const express = require("express");
const connectDB = require("./config/db");;

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


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});