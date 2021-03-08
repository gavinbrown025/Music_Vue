const express = require('express');
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname + '/dist/'));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});