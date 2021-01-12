/*****app views****/
import {recipe,favorites,userInputs,lightbox,errorThrown} from './data.js';


/**Compenents**/
var header = {//header bar
  view: ()=>{
    return m(".header",[
      m(".lightbox", [favorites.all.map((item) => {//favorited recipes lightbox
         return m(".favoriteRecipe",{onclick: () =>{
          recipe.getRecipe(item.id);
         }},item.title)})
      ]),
      m(".background.hidden", {onclick: lightbox.close}),
      m("img.favoriteNavIcon",{src: "./public/favoritedIcon.png", onclick: favorites.getAll}),
      m(".centerText", "Recipe App")
    ])
  }
}

var headerBackBtn = {//header bar
  view: ()=>{
    return m(".header",[
        m("img.backBtn", {alt: "navigate back",src: "/public/back.png", onclick: ()=>{window.location = "#!/main"}}),
      m(".centerText", "Recipe App")
    ])
  }
}

var homeScreen = {//home screen
  view: ()=>{
    return m("homeScreen.contentView",[
      m(header),
      m(".pageContent",[
        m(".pageSection", [
          m(".sectionHeader","Recipe type"),
          m(".inputList",userInputs.types.map((item) => {
             return m(".btn.inputItem.recipeType",{onclick: (e)=>{userInputs.onTypesClick(e)}, data: item.value},item.text)
          }))
        ]),
        m(".pageSection", [
          m(".sectionHeader","Intolerances"),
          m(".inputList",userInputs.intolerances.map((item) => {
             return m(".btn.inputItem.intolerance",{onclick: (e)=>{userInputs.onIntoleranceClick(e)}},item)
          }))
        ]),
        m(".recipeSearch.btn",{onclick: recipe.search}  ,"Search for recipe")
      ])
    ])
  }
}

var recipeScreen = {//selected recipe screen
  view: ()=>{
    return m("recipeScreen.contentView",[
      m(headerBackBtn),
      m(".pageContent",[
        m(".heroImage",[
          m("img", {src: recipe.details.image, alt: "image"})//after the image has loaded fade it in
        ]),
        m(".pageSection.favoriteBtn", [
          m("div",recipe.details.title),
          m("img",{src: recipe.favoriteIcon, onclick: recipe.favoriteFunction, oninit: (vnode) => {if (!('indexedDB' in window)) {vnode.attrs.className = "saved hidden";}}})
        ]),
        m(".pageSection", [
          m("div","Ingredients"),
          m(".ingredientList",recipe.details.ingredients.map((item) => {
             return m(".ingredient",item)
          }))
        ]),
        m(".pageSection", [
          m("div","Cooking directions"),
          m(".directionList",recipe.details.directions.map((item) => {
             return m(".direction",item)
          }))
        ])
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
        m("div","Loading")
      ])
    ])
  }
}

var errorScreen = {//screen showing errors
  oncreate: ()=>{
    history.replaceState(null, "home", "#!/home");//update browers history to skip the loading screen if the back button is used
  },
  view: () =>{
    return m("errorScreen.contentView",[
      m(headerBackBtn),
      m(".pageContent",[
        m(".centerText",errorThrown),
        m(".btn",{onclick: ()=>{window.location = "#!/home";}} ,"Try Again")
      ])
    ])
  }
}

export{homeScreen,loadScreen,errorScreen,recipeScreen};
