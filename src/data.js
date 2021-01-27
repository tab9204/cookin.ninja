/**********Data for rendering app views************/
//error screen text
var errorThrown = "";
//recipe related functions and data
var recipe = {
  details:{//the details of the recipe returned by the api
    image: null,
    imageBlob: null,
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
    //get the 30 min and under checkbox
    var maxTime = document.querySelectorAll("input")[0].checked ? 20 : 300;

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
        maxReadyTime: maxTime
      }
    })
    .then((result) =>{
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
        title: result.results[0].title,
        summary: result.results[0].summary,
        ingredients: ingredients,
        directions: directions,
        id: result.results[0].id
      };
      //get the image from the url and return it as a blob
      fetch(result.results[0].image)
        .then(function(response) {
          return response.blob()
        })
        .then(function(blob) {
          recipe.details.imageBlob = blob;
          //convert blog to url
          recipe.details.image = URL.createObjectURL(blob);

          //since this is a new search the favorite button should be set to the  not favorited option
          favorites.showAsNotFavorited();

          window.location = "#!/recipe";//update the url to show the food screen
        });
    })
    .catch((error) =>{//show the error
      errorThrown = error;
      console.log(errorThrown);
      window.location = "#!/error";
    })
  },
  getRecipe: function(id){//gets the specified recipe from the database
    idb.openDB('favorites', 1).then((db) =>{
      var tx = db.transaction(['recipes'], 'readonly');
      var store = tx.objectStore('recipes');
      return store.get(id);
    }).then((item) =>{
      recipe.details = item;//set the recipe details to be the saved recipe details
      recipe.details.image = URL.createObjectURL(recipe.details.imageBlob);
      //the favorite button should show as favorited
      favorites.showAsFavorited();

      window.location = "#!/recipe";//navigate to the recipe screen to show the recipe

    }).catch((error) =>{
      errorThrown = error;
      console.log(errorThrown);
      window.location = "#!/error";
    })
  },
  saveRecipe: function(id){//adds the current recipe to the favorites database
    favorites.showAsLoading();//show the loading gif
    idb.openDB('favorites', 1).then((db) =>{
      var tx = db.transaction(['recipes'], 'readwrite');
      var store = tx.objectStore('recipes');
      var newItem = recipe.details;
      store.put(newItem);
      return tx.complete;
    }).then(() =>{
      setTimeout(() =>{//make sure to wait at least 1 second before showing the new button
        //favroite button should now show as favorited
        favorites.showAsFavorited();
        m.redraw();//view needs to be redrawn
      }, 1000);
    }).catch((error) =>{
      errorThrown = error;
      console.log(errorThrown);
      window.location = "#!/error";
    })
  },
  removeRecipe: function(id){//deletes the current recipe from the favorites database
    favorites.showAsLoading();//show the loading gif on button click
    idb.openDB('favorites', 1).then((db) =>{
      var tx = db.transaction(['recipes'], 'readwrite');
      var store = tx.objectStore('recipes');
      store.delete(recipe.details.id);
      return tx.complete;
    }).then((x) =>{
      setTimeout(() =>{//make sure to wait at least 1 second before showing the new button
        //favorite button should now show as not favorited
        favorites.showAsNotFavorited();
        m.redraw();//view needs to be redrawn
      }, 1000);
    }).catch((error) =>{
      errorThrown = error;
      console.log(errorThrown);
      window.location = "#!/error";
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
        favorites.all = [];
      }
      else{
        favorites.all = items;//return the array of items from the db
      }
      lightbox.open();
      m.redraw();//redraw the view
    }).catch((e) =>{//there was an error reading the DB so return no results
      favorites.all =  [];
    })
  },
  showAsFavorited: function(){//shows the favorited button
    recipe.favoriteIcon = "../assets/favoritedIcon.png";
    recipe.favoriteFunction = recipe.removeRecipe;
  },
  showAsNotFavorited: function(){//shows the not favorited button
    recipe.favoriteIcon = "../assets/notFavoritedIcon.png";
    recipe.favoriteFunction = recipe.saveRecipe;
  },
  showAsLoading: function(){//shows the loading icon
    recipe.favoriteIcon = "../assets/loading.gif";
    recipe.favoriteFunction = null;
  }
}

//data and functions related to the user input controls
var userInputs = {
  intolerances: ["Dairy","Egg","Gluten","Grain","Peanut","Seafood"],
  types: [
    {text: "Main", value: "main course"},
    {text: "Side Dish", value: "side dish"},
    {text: "Appetizer", value: "appetizer"},
    {text: "Soup", value: "soup"},
    {text: "Dessert", value: "dessert"},
    {text: "Snack", value: "snack"}
  ],
  onIntoleranceClick: function(e){
    e.target.classList.toggle("selected");
  },
  onTypesClick: function(e){
    var allRecipeTypes = document.querySelectorAll(".inputItem.recipeType");
    allRecipeTypes.forEach((item, i) => {
      item.classList.remove("selected");
    });
    e.target.classList.add("selected");
  },
  onBackBtnClick: function(){
    URL.revokeObjectURL(recipe.details.image);
    window.location = "#!/main";
  }
}

var lightbox = {//closes the favorite recipe lightbox section
  close: function(){
    document.getElementsByClassName("lightbox")[0].classList.add("slideOut");//slide out of frame
    document.getElementsByClassName("lightbox")[0].classList.remove("slideIn");//remove the slide in class
    document.getElementsByClassName("lightboxBackground")[0].classList.add("hidden");//hide the lightbox background
  },
  open: function(){
    document.getElementsByClassName("lightbox")[0].classList.remove("slideOut");//remove the slide out class
    document.getElementsByClassName("lightbox")[0].classList.add("slideIn");//slide into frame
    document.getElementsByClassName("lightboxBackground")[0].classList.remove("hidden");//show the lightbox background
  }
}


export{recipe,favorites,userInputs,lightbox,errorThrown};
