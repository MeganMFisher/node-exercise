const express = require('express')
, app = express()
, axios = require('axios')
, port = 4000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
res.render('index')
})


app.get('/character/:name', (req, res) => {
    const { name } = req.params;
    axios.get('https://swapi.co/api/people/1/').then(response => {
        res.send(response.data)
    })
    //Returns an EJS view (nothing too fancy) with data about the given character. (Needs to work with at least 'luke', 'han', 'leia', and 'rey')
})


app.get('/characters', (req, res) => {
    axios.get('https://swapi.co/api/people').then(response => {
        res.send(response.data.results)
    })
    // Returns raw JSON of 50 characters (doesn't matter which 50). This endpoint should be able to take a query parameter in the URL called 'sort'  and the potential sort parameters will be 1 of the following, ['name', 'mass', 'height']  So the endpoint '/characters?sort=height' should return JSON of 50 characters sorted by their height. 
})

app.get('/planetresidents', (req, res) => {
    axios.get('https://swapi.co/api/planets').then(response => {
        res.send(response.data.results)
    })
    //return raw JSON in the form {planetName1: [characterName1, characterName2], planetName2: [characterName3]}   So it is an object where the keys are the planet names, and the values are lists of residents names for that planet
})


app.listen(port, () => {
console.log(`Listening on port ${port}`);
})