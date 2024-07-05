var express = require('express');
var router = express.Router();

// =================== mongoDB setup ===================
const mongoose = require('mongoose');
const Recipe = require("../models/Recipe");

const mongoDB = 'mongodb://127.0.0.1:27017/testdb';
mongoose.connect(mongoDB)
        .then(() => console.log("Nani, MongoDB is connected!"))
        .catch((error) => console.log(` Nani, Error has occured: ${error}`));

mongoose.Promise = Promise;
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Nani, MongoDB connection error!!!"));
// =====================================================

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// My code

let recipes = [{ 
  name : 'Pizza',
  instructions: ['Make the dough', 'add the toppings', 'bake in the oven', 'Enjoy!'],
  ingredients: ['flour', 'tomato', 'cheese', 'pepperoni']
}];

// saving recipe to database--------------------------------

function initializeRecipes(){
  Recipe.findOne({name: 'Pizza'})
        .then((recipe) => {
          if(!recipe){
            let pizzaRecipe = new Recipe({
                name: 'Pizza',
                instructions: ['Make the dough', 'add the toppings', 'bake in the oven', 'Enjoy!'],
                ingredients: ['flour', 'tomato', 'cheese', 'pepperoni']
              });
            pizzaRecipe.save();
            }
        }).catch((error) => {
          console.log(`Some error occured: ${error}!!!`);
        });
}

initializeRecipes();
// -----------------------------------------------------------

router.get("/recipe/:food", (req, res)=>{
  Recipe.findOne({name: req.params.food})
        .then((recipe) => {
          if(recipe){
            res.json(recipe);
          }
          else{
            let defaultResponse = { 
              name: req.params.food,
              instructions: ["Default instructions"],
              ingredients: ["Default ingredients"]
            };
            res.json(defaultResponse);
          }
        })
        .catch((error) => {
          res.status(500).json({msg: `Error occured: ${error}!!!`});
        });
});

router.post("/recipe/", (req, res)=>{
  Recipe.findOne({name: req.body.name})
        .then((recipe) => {
          if(recipe){
            // I wanted to merge the ingredients and instructions with the existing recipe
            req.body.ingredients.push("something added");
            req.body.instructions.push("something added");
            res.json(req.body);
          }
          else{
            let newRecipe = new Recipe({
              instructions: req.body.instructions,
              ingredients: req.body.ingredients,
              name: req.body.name
            });
            newRecipe.save();
            res.json(req.body);
          }
        })
        .catch((error) => {
          res.status(500).json({msg: `Error occured: ${error}!!!`});
        });
});

router.post("/images", (req, res) => {
  res.json({msg: "Image uploaded"});
});

module.exports = router;
