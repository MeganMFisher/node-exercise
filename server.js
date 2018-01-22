const express = require('express')
    , app = express()
    , axios = require('axios')
    , port = 8081;

app.set('view engine', 'ejs');


app.get('/character/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const response = await axios.get(`https://swapi.co/api/people/?search=${name}`)
        let character = response.data.results[0];
        res.render('character', { character })
    } catch(e) { console.log(e) }
})


app.get('/characters', async (req, res) => {
    try {
        const { sort } = req.query 
        var characterList = []; 
        var page = 1;
        while(characterList.length < 50){
            const response = await axios.get(`https://swapi.co/api/people/?page=${page}`)
            characterList = [...characterList, ...response.data.results]
            page++
        }
        characterList.sort((a, b) => a[sort] - b[sort])
        res.send(JSON.stringify(characterList))
    } catch(e) { console.log(e) }
})


app.get('/planetresidents', async (req, res) => {
    try {
        var obj = {};
        const response = await axios.get('https://swapi.co/api/planets')
        let data = response.data.results
        const residents = await Promise.all(data.map(planets => Promise.all(planets.residents.map(residents => axios.get(`${residents}`).then(res => res.data.name)))))
        data.forEach((planet, i) => obj[planet.name] = residents[i])
        res.send(JSON.stringify(obj))
    } catch(e) { console.log(e) }
})


app.listen(port, () => {
console.log(`Listening on port ${port}`);
})