const express = require('express')
    , app = express()
    , axios = require('axios')
    , port = 4000;

app.set('view engine', 'ejs');

app.get('/character/:name', (req, res) => {
    const { name } = req.params;
    axios.get(`https://swapi.co/api/people/?search=${name}`).then(response => {
        let character = response.data.results[0];
        res.render('character', {
            character
        })
    }).catch(error => console.log(error));
})


app.get('/characters', (req, res) => {
    const { sort } = req.query 
    var page = 1;
    var characterList = []; 
    (function characters() {
        axios.get(`https://swapi.co/api/people/?page=${page}`).then(response => {
            if(page <= 5){
                characterList = [...characterList, ...response.data.results]
            page++
            characters()
            } else {
                characterList.sort(function(a, b) {
                    return a[sort] - b[sort]
                })
                res.send(JSON.stringify(characterList))
            }
        }).catch(error => console.log(error));
    })();  
})



app.get('/planetresidents', (req, res) => {
    axios.get('https://swapi.co/api/planets').then(response => {
        let data = response.data.results
        let obj = {}; 


            Promise.all(data.map(planets=> {
                return Promise.all(planets.residents.map(residents => {
                     return axios.get(`${residents}`)
                     .then(resp => {
                         return resp.data.name
                     })
                }))
            })).then(result => {
                var obj = {};
                data.forEach((person, i) =>{
                        obj[person.name] = result[i];
                })
                res.send(JSON.stringify(obj))
            })

    })
    //return raw JSON in the form {planetName1: [characterName1, characterName2], planetName2: [characterName3]}   So it is an object where the keys are the planet names, and the values are lists of residents names for that planet
})


app.listen(port, () => {
console.log(`Listening on port ${port}`);
})