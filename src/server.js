/* eslint-disable quotes */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const POKEDEX = require('../pokedex.json')

const app = express();

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
   const apiToken = process.env.API_TOKEN

    if (!authToken || authToken.split(" ")[1] !== apiToken) {
             return res.status(401).json({ error: 'Unauthorized request' })
           }
       // move to the next middleware
       next()
     });

    

app.get('/types', handleGetTypes);


const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];

function handleGetTypes(req, res) {
  res.json(validTypes);
}


app.get('/pokemon', function handleGetPokemon(req, res) {
    let response = POKEDEX.pokemon;
    const { type, name } = req.query;
  
 // filter our pokemon by name if name query param is present
 if (name) {
    response = response.filter(pokemon =>
      // case insensitive searching
      pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
    )
  }

  // filter our pokemon by type if type query param is present
  if (type) {
    const filterType = type.charAt(0).toUpperCase() + type.toLowerCase().slice(1);
      response = response.filter(pokemon =>
      pokemon.type.includes(filterType))
          
  }

  res.json(response)
})
    
app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

    
    

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});