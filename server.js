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

        // for(var i = 0; i < data.length; i++){
        //     obj[data[i].name] = data[i].residents
        // }
        
        // for(let key in obj){
        //     for(let i = 0; i < obj[key].length; i++){
        //         axios.get(`${obj[key][i]}`).then(response => {  
        //             obj[key][i] = response.data.name
        //             console.log(obj)
        //             res.write(JSON.stringify(obj))
                    
        //         })
        //     }
        // }

        var counter = 0;
        
        for(let i = 0; i < data.length; i++) {
            let planets = data[i].residents
            for(let j = 0; j < planets.length; j++){
                axios.get(`${planets[j]}`).then(response => {  
                    planets[j] = response.data.name
                    obj[data[i].name] = data[i].residents
                    console.log(obj)
                    if(counter === data.length - 1){
                        res.send(JSON.stringify(obj))
                    }
                    counter++
                })
            }
        }
    })
    //return raw JSON in the form {planetName1: [characterName1, characterName2], planetName2: [characterName3]}   So it is an object where the keys are the planet names, and the values are lists of residents names for that planet
})


app.listen(port, () => {
console.log(`Listening on port ${port}`);
})