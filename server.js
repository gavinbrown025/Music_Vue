const express = require('express');
const app = express();

const port = process.env.PORT || 8080;

app.use(express.static("dist"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
