const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RecipeSchema = new Schema({
    instructions: Array,
    ingredients: Array,
    name: String,
    categories: Array,
    images: Array
},
//{ collection: "Recipes"} // explicitly specifying the collection name
);

module.exports = mongoose.model("Recipe", RecipeSchema);