let nameToAdd = document.getElementById('name-text');
nameToAdd.value = 'Pizza'; // default value for Task 2

let ingredientInput = document.getElementById('ingredients-text');
let instructionInput = document.getElementById('instructions-text');

let addButton = document.getElementById('submit');
let addIngredient = document.getElementById('add-ingredient');
let addInstruction = document.getElementById('add-instruction');

let imageInput = document.getElementById('image-input');
let form = document.getElementById('recipe-form');

let instructionList = [];
let ingredientList = [];
let categoryList = [];

let categories = [];
let catagoryData = []; // to store all category info including id

addButton.addEventListener('click', ()=>{
    checkCategory(); // checks which categories are checked
    let name = nameToAdd.value;
    let recipe = {
        name: name,
        ingredients: ingredientList,
        instructions: instructionList,
        categories: categoryList
    };

    try {
        fetch("/recipe/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(recipe)
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            createElements(data);
            console.log(data);
            instructionList = [];
            ingredientList = [];
        })}
    catch (error) {
        console.log('error');
    }
});

form.addEventListener('submit', (e) => {
 
    e.preventDefault();
    const formData = new FormData(form);
    
    // Wrapping the images in a FormData object and Fetching the images
    for (let i = 0; i < imageInput.files.length; i++) {
        formData.append('images', imageInput.files[i]);
        console.log(imageInput.files[i]);
    }

    fetch("/images", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        fetchData();
    });
});

addIngredient.addEventListener('click', ()=>{
    let ingredient = ingredientInput.value;
    ingredientList.push(ingredient);
    console.log(ingredientList);
});

addInstruction.addEventListener('click', ()=>{
    let instruction = instructionInput.value;
    instructionList.push(instruction);
    console.log(instructionList);
});

function fetchData(){
    const name = nameToAdd.value; 
    fetch("/recipe/" + name)
    .then(response => {
        return response.json();  
    })
    // or simply .then(response => response.json())
    .then(data => {
        createElements(data);
    })
    .catch(error => {
        console.log(error)
    });
};

function createElements(data){
    let displayDiv = document.getElementById('displayDiv');
    displayDiv.innerHTML = '';

    let h1 = document.createElement('h1');
    h1.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    displayDiv.appendChild(h1);
    
    let h2_1 = document.createElement('h2');
    h2_1.textContent = "Ingredients";
    displayDiv.appendChild(h2_1);

    let ol1 = document.createElement('ol');
    data.ingredients.forEach(element => {
        let li = document.createElement('li');
        li.textContent = element;
        ol1.appendChild(li);
    });
    displayDiv.appendChild(ol1);

    let h2_2 = document.createElement('h2');
    h2_2.textContent = "Instructions";
    displayDiv.appendChild(h2_2);

    let ol2 = document.createElement('ol');
    data.instructions.forEach(element => {
        let li = document.createElement('li');
        li.textContent = element;
        ol2.appendChild(li);
    });
    displayDiv.appendChild(ol2);
};

fetchData();

let searchButton = document.getElementById('search');
searchButton.addEventListener('keyup', (e) => {
    if(e.keyCode === 13){
        nameToAdd.value = searchButton.value;
        fetchData();
    }
});

function fetchCategory(){
    try {
        fetch("/categories")
        .then(response => response.json())
        .then(data => {
            catagoryData = data;
            data.forEach(category => {
                categories.push(category.name);
            });
            return createCategoryElements();
        });
    }
    catch (error) {
        console.log('error is, nani,' + error);
    }
}

function createCategoryElements(){
    let fieldSet = document.getElementById('category-fieldset');
    let legend = document.createElement('legend');
    legend.textContent = 'Categories';
    fieldSet.appendChild(legend);
    
    categories.sort();
    categories.forEach(category => {
        let p = document.createElement('p');
        let label = document.createElement('label');
        let input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'category';
        input.value = category;
        let span = document.createElement('span');
        span.textContent = category;
        label.appendChild(input);
        label.appendChild(span);
        p.appendChild(label);
        p.appendChild(document.createElement('br'));
        fieldSet.appendChild(p);
    });
}

function checkCategory(){
    let checkboxes = document.querySelectorAll('input[name="category"]:checked');
    // It also worked as input[type="checkbox"] but name is more specific

    checkboxes.forEach(checkbox => {
        let name = checkbox.value;
        let id = catagoryData.find(category => category.name === name)._id;
        categoryList.push(id);
    });
}

fetchCategory();