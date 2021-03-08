const express = require('express');
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname + '/dist/'));

//! so it can redirect all refreshes to index file where it can handle the routes
app.get(/.*/, function(req, res){
    res.sendFile(__dirname + '/dist/index.html');
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});