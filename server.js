//need fs to add POST user data to existing animals.json file
const fs = require('fs');

//provides utilities for working with file and directory paths
const path = require('path');

//ES5
const express = require('express');


//creating a route that the front-end can request data from 
const { animals } = require('./data/animals');
const e = require('express');

const PORT = process.env.PORT || 3001;

//server will only function to take fetched data and display it to client

//TO DO: SET UP SERVER --> 1) Initialize the server
//                         2) Listen for requests 

// 1) Initialize the server
//initializing app variable so that we can chain methods to express js server
const app = express();

//parse incoming string or array data
//.use() is a method executed by express js server. This mounts a function to the server that requests will pass through before getting to intended endpoint
//these functions are called middleware functions 
//urlencoded is a method built into expressjs. Takes incoming POST data and converts it to key/value pairs 
//we use extended: true to tell the server that there could be nested array data and to check thoroughly to parse all the data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
//takes incoming POST data in the form of JSON and parses it into req.body js object
app.use(express.json());


// 2) Listen for requests 

// using listen() method to make server listen 
app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
})

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
                );
            });
        }
        if (query.diet) {
            filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
        }
        if (query.species) {
            filteredResults = filteredResults.filter(animal => animal.species === query.species);
        }
        if (query.name) {
            filteredResults = filteredResults.filter(animal => animal.name === query.name);
        }
        return filteredResults;
    }
    
    function findById(id, animalsArray) {
        const result = animalsArray.filter(animal => animal.id === id)[0];
        return result;
    }
    //function accepts req.body value and the animalsArray we want to add the data to
    function createNewAnimal(body, animalsArray) {
        const animal = body;
        animalsArray.push(animal);

        //since we use the syncronous version of writefile, we dont need a callback function
        fs.writeFileSync(
            path.join(__dirname, '/data/animals.json'),
            JSON.stringify({ animals: animalsArray }, null, 2),
            
        );
console.log(path)
        //return finished code to post route for response
        return animal;
    }
    
    app.get('/data/animals', (req, res) => {
        let results = animals;
        if (req.query) {
            results = filterByQuery(req.query, results);
        }
        res.json(results);
    });
    
    app.get('/data/animals/:id', (req, res) => {
        const result = findById(req.params.id, animals);
        if (result) {
            res.json(result);
        } else {
            res.send(404);
        }

    });

    //uses the express server to listen for a post request from the client 
    app.post('/data/animals', (req, res) => {
        //req.body is where our incoming content will be 
        //set id based on what the next index of the array will be 
        req.body.id = animals.length.toString();

        if (!validateAnimal(req.body)) {
            res.status(400).send('The animal is not properly formatted.');
        } else {
            //add animal to json file and animals array in this function 
            const animal = createNewAnimal(req.body, animals);
            res.json(animal);
        }

    });

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;  
    }
    if(!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
};