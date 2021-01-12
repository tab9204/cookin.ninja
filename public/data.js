/**********Data for rendering app views************/
//error screen text
var errorThrown = "";

//recipe related functions and data
var recipe = {
  details:{//the details of the recipe returned by the api
    image: null,
    title: null,
    summary: null,
    ingredients: null,
    directions: null,
    id: null
  },
  favoriteIcon: null,//the image used for the favorite recipe icon
  favoriteFunction: null,//the function called when the favorite icon is clicked
  search: function() {//uses the api to serach and return a random recipe
    window.location = "#!/load";//show the load screen while waiting for the api result
    //get the selected recipe type
    //if none are selected leave it blank
    var recipeType = document.querySelectorAll(".inputItem.recipeType.selected").length >= 1 ? document.querySelectorAll(".inputItem.recipeType.selected")[0].attributes.data.value : "";
    //get the selected intolerances
    var intolerances = "";
    var selectedIntolerances = document.querySelectorAll(".inputItem.intolerance.selected");
    selectedIntolerances.forEach((item, i) => {
      if(i <= 0){intolerances += item.textContent}//add the first intolerance without a comma
      else{intolerances += ","+item.textContent}
    });

    m.request({//api call
      method: "GET",
      url: "https://api.spoonacular.com/recipes/complexSearch",
      params: {
        apiKey:"cdf510754c3541e8a42f14b7384540d1",
        instructionsRequired:true,
        fillIngredients:true,
        addRecipeInformation:true,
        number:1,
        sort:"random",
        type: recipeType,
        intolerances:intolerances,
      }
    })
    .then((result) =>{
      console.log(result);
      //parse the ingredients
      var ingredients = [];
      result.results[0].extendedIngredients.forEach((item, i) => {
        ingredients.push(item.original);
      });
      //parse the directions
      var directions = [];
      result.results[0].analyzedInstructions[0].steps.forEach((item, i) => {
        directions.push(item.step);
      });
      //fill out the details object with the returned data
      recipe.details = {
        image: result.results[0].image,
        title: result.results[0].title,
        summary: result.results[0].summary,
        ingredients: ingredients,
        directions: directions,
        id: result.results[0].id
      };
      //since this is a new search the favorite button should be set to the favorite option
      recipe.favoriteIcon = "./public/notFavoritedIcon.png";
      recipe.favoriteFunction = recipe.saveRecipe;

      window.location = "#!/recipe";//update the url to show the food screen
    })
    .catch((error) =>{//show the error
      errorThrown = error;
      window.location = "#!/error";
    })
  },
  getRecipe: function(id){//gets the specified recipe
    idb.openDB('favorites', 1).then((db) =>{
      var tx = db.transaction(['recipes'], 'readonly');
      var store = tx.objectStore('recipes');
      return store.get(id);
    }).then((item) =>{
      recipe.details = item;//set the recipe details to be the saved recipe details

      //the favorite button should show as favorited
      recipe.favoriteIcon = "./public/favoritedIcon.png";
      recipe.favoriteFunction = recipe.removeRecipe;

      window.location = "#!/recipe";//navigate to the recipe screen to show the recipe
    }).catch((e) =>{
      console.log(e);
    })
  },
  saveRecipe: function(id){//adds the current recipe to the favorites database
    idb.openDB('favorites', 1).then((db) =>{
      var tx = db.transaction(['recipes'], 'readwrite');
      var store = tx.objectStore('recipes');
      var newItem = recipe.details;
      store.put(newItem);
      return tx.complete;
    }).then(() =>{
      //favroite button should now show as favorited
      recipe.favoriteIcon = "./public/favoritedIcon.png";
      recipe.favoriteFunction = recipe.removeRecipe;
      m.redraw();//view needs to be redrawn
    }).catch((e) =>{
      console.log(e);
    })
  },
  removeRecipe: function(id){//deletes the current recipe from the favorites database
    idb.openDB('favorites', 1).then((db) =>{
      var tx = db.transaction(['recipes'], 'readwrite');
      var store = tx.objectStore('recipes');
      store.delete(recipe.details.id);
      return tx.complete;
    }).then((x) =>{
      //favorite button should now show as not favorited
      recipe.favoriteIcon = "./public/notFavoritedIcon.png";
      recipe.favoriteFunction = recipe.saveRecipe;
      m.redraw();//view needs to be redrawn
    }).catch((e) =>{
      console.log(e);
    })
  },
}

//favorited recipe functions and data
var favorites = {
  all: [],//array of all favorited recipes
  getAll: function(){//gets all recipes in the favorites database
    idb.openDB('favorites', 1).then((db) =>{
      var tx = db.transaction(['recipes'], 'readonly');
      var store = tx.objectStore('recipes');
      return store.getAll();
    }).then((items) =>{
      if(items.length <= 0){//if there is no results
        favorites.all = [{title:"No favorited recipes"}];
      }
      else{
        favorites.all = items;//return the array of items from the db
      }
      lightbox.open();
      m.redraw();//redraw the view
    }).catch((e) =>{//there was an error reading the DB so return no results
      favorites.all =  [{title:"No favorited recipes"}];
    })
  }
}

//data and functions related to the user input controls
var userInputs = {
  intolerances: ["Dairy","Egg","Gluten","Grain","Peanut","Seafood","Sesame","Shellfish","Soy","Sulfite","Tree Nut","Wheat"],
  types: [
    {text: "Main", value: "main course"},
    {text: "Side Dish", value: "side dish"},
    {text: "Appetizer", value: "appetizer"},
    {text: "Soup", value: "soup"},
    {text: "Dessert", value: "dessert"},
    {text: "Snack", value: "snack"}
  ],
  onIntoleranceClick: function(e){
    e.target.classList.add("selected");
  },
  onTypesClick: function(e){
    var allRecipeTypes = document.querySelectorAll(".inputItem.recipeType");
    allRecipeTypes.forEach((item, i) => {
      item.classList.remove("selected");
    });
    e.target.classList.add("selected");
  }
}

var lightbox = {//closes the favorite recipe lightbox section
  close: function(){
    document.getElementsByClassName("lightbox")[0].classList.add("slideOut");//slide out of frame
    document.getElementsByClassName("lightbox")[0].classList.remove("slideIn");//remove the slide in class
    document.getElementsByClassName("background")[0].classList.add("hidden");//hide the lightbox background
  },
  open: function(){
    document.getElementsByClassName("lightbox")[0].classList.remove("slideOut");//remove the slide out class
    document.getElementsByClassName("lightbox")[0].classList.add("slideIn");//slide into frame
    document.getElementsByClassName("background")[0].classList.remove("hidden");//show the lightbox background
  }
}


export{recipe,favorites,userInputs,lightbox,errorThrown};
