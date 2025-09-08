import express from "express";

const app = express();
const port = 5000;

app.get("/", (_req, res) => {
    res.send("Hello World! In Docker");
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
