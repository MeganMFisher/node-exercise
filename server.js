const express = require('express')
, app = express()
, port = 4000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
res.render('index')
})




app.listen(port, () => {
console.log(`Listening on port ${port}`);
})