import express from "express";

const app = express();

app.use('/', (req, res) => {
    return res.json("Hello from food order Backend !!")
})

app.listen(8000, () => {
    console.log( `server is running on http://localhost:${8000}`)
})