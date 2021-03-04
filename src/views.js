/*****app views****/
import {recipe,indexDB,userInputs,lightbox,errorThrown} from './data.js';
import {Swiper} from "./swipe.js";


/**Compenents**/
var header = {//header bar
  oncreate: ()=>{
    var swipes = {left: lightbox.close}
    var lightboxSwipe = new Swiper(document.getElementsByClassName("lightbox")[0],swipes)
  },
  view: ()=>{
    return m(".header",[
      m(".lightbox", [
        m(".lightboxHeader", "Saved Recipes"),
        recipe.all.map((item,i,array) => {//favorited recipes lightbox
          return m(".savedRecipe",{onclick: () =>{
            indexDB.getRecipe(item.id);
          }},[
            m(".savedRecipeTitle",item.title),
            m("img.forwardImage",{src: "../assets/forward.png"})
          ]
        )})
      ]),
      m(".lightboxBackground.hidden", {onclick: lightbox.close}),
      m("img.savedNavIcon",{src: "../assets/savedNavIcon.png", onclick: indexDB.getAll}),
      m(".centerText", "cookin.ninja")
    ])
  }
}

var headerBackBtn = {//header bar
  view: ()=>{
    return m(".header",[
        m("img.backBtn.fadeIn", {alt: "navigate back",src: "../assets/back.png", onclick: userInputs.onBackBtnClick}),
      m(".centerText", "cookin.ninja")
    ])
  }
}

var homeScreen = {//home screen
  oncreate: ()=>{
    if(recipe.loadingError){
      errorThrown.show();
      recipe.loadingError = false;
    }
  },
  view: ()=>{
    return m("homeScreen.contentView",[
      m(header),
      m(".pageContent",[
        m(".pageSection", [
          m(".sectionHeader","What's cookin?"),
          m(".inputList",userInputs.types.map((item) => {
             return m(".btn.inputItem.recipeType",{onclick: (e)=>{userInputs.onTypesClick(e)}, data: item.value},item.text)
          }))
        ]),
        m(".pageSection.switchSection", [
          m(".sectionHeader", "Exclude Dairy?"),
          m("label.switch",[
            m("input.dairy", {type: "checkbox"}),
            m("div.slider")
          ])
        ]),
        m(".pageSection.switchSection", [
          m(".sectionHeader", "Quick recipes only?"),
          m("label.switch",[
            m("input.quick", {type: "checkbox"}),
            m("div.slider")
          ])
        ]),
        m(".recipeSearch",{onclick: recipe.search}  ,"Find a recipe"),
        m(errorPopup)
      ])
    ])
  }
}

var offlineScreen = {//home screen when offline
  view: ()=>{
    return m("offlineScreen.contentView",[
      m(header),
      m(".pageContent",[
        m(".pageSection", [
          m(".sectionHeader","You are offline. Saved recipes can be viewed but new ones cannot be found until you connect to the internet."),
        ])
      ])
    ])
  }
}
var render = true;

var recipeScreen = {//selected recipe screen
  view: ()=>{
    return m("recipeScreen.contentView",[
      m(headerBackBtn),
      m(".pageContent",[
        m(".heroSection",[
          m("img.heroImage.fadeIn", {src: recipe.details.image, alt: "image"})
        ]),
        m(".pageSection.favoriteSection.fadeIn", [
          m(".favoriteTitle",recipe.details.title),
          m("img.favoriteImage",{src: recipe.favoriteIcon, onclick: recipe.favoriteFunction, class: render ? "" : "hidden"})
        ]),
        m(".pageSection.fadeIn", [
          m(".listTitle","Ingredients"),
          m(".ingredientList",recipe.details.ingredients.map((item) => {
             return m(".ingredient",item)
          }))
        ]),
        m(".pageSection.fadeIn", [
          m(".listTitle","Cooking directions"),
          m(".directionList",recipe.details.directions.map((item) => {
             return m(".direction",item)
          }))
        ]),
        m(errorPopup)
      ])
    ])
  }
}

var loadScreen ={//screen to show while requests are loaded
  oncreate: ()=>{
    history.replaceState(null, "home", "#!/home");//update browers history to skip the loading screen if the back button is used
  },
  view: () =>{
    return m("loadingScreen.contentView",[
      m(".pageContent",[
        m("img.loadingImage",{src:"../assets/loading.gif"}),
        m(errorPopup)
      ])
    ])
  }
}

var errorPopup = {//popup containing an error message should an error be thrown
  view: () =>{
    return m(".errorPopup",errorThrown.message)
  }
}

export{homeScreen,loadScreen,recipeScreen,offlineScreen};
