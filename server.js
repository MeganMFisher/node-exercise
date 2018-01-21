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


app.get('/characters', (req, res) => {
    const { sort } = req.query 
    var page = 1;
    var characterList = []; 
    (async function characters() {
        try {
            const response = await axios.get(`https://swapi.co/api/people/?page=${page}`)
            if(page <= 5){
                characterList = [...characterList, ...response.data.results]
                page++
                characters()
            } else {
                characterList.sort((a, b) => a[sort] - b[sort])
                res.send(JSON.stringify(characterList))
            }
        } catch(e) { console.log(e) } 
    })(); 
})


app.get('/planetresidents', async (req, res) => {
    try {
        const response = await axios.get('https://swapi.co/api/planets')
        let data = response.data.results
        var obj = {};
        (async () => {
            try {
                const residents = await Promise.all(data.map(planets=> {
                    return Promise.all(planets.residents.map(residents => axios.get(`${residents}`)
                    .then(resp => resp.data.name)
                    ))
                }))
                data.forEach((planet, i) => obj[planet.name] = residents[i])
                res.send(JSON.stringify(obj))
            } catch(e) { console.log(e) } 
        })()
    } catch(e) { console.log(e) } 
})


app.listen(port, () => {
console.log(`Listening on port ${port}`);
})