/*****app views****/
import {recipe,favorites,userInputs,lightbox,errorThrown} from './data.js';
import {attachEventHandlers} from "./swipe.js";


/**Compenents**/
var header = {//header bar
  oncreate: ()=>{
    attachEventHandlers();
  },
  view: ()=>{
    return m(".header",[
      m(".lightbox", [
        m(".lightboxHeader", "Saved Recipes"),
        favorites.all.map((item) => {//favorited recipes lightbox
          return m(".savedRecipe",{onclick: () =>{
            recipe.getRecipe(item.id);
          }},[
            m(".savedRecipeTitle",item.title),
            m("img.forwardImage",{src: "../assets/forward.png"})
          ]
        )})
      ]),
      m(".lightboxBackground.hidden", {onclick: lightbox.close}),
      m("img.savedNavIcon",{src: "../assets/savedNavIcon.png", onclick: favorites.getAll}),
      m(".centerText", "Recipe App")
    ])
  }
}

var headerBackBtn = {//header bar
  view: ()=>{
    return m(".header",[
        m("img.backBtn", {alt: "navigate back",src: "../assets/back.png", onclick: userInputs.onBackBtnClick}),
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
        m(".pageSection.switchSection", [
          m(".sectionHeader", "30 minutes or less"),
          m("label.switch",[
            m("input", {type: "checkbox"}),
            m("div.slider")
          ])
        ]),
        m(".recipeSearch.btn",{onclick: recipe.search}  ,"Search for recipe")
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
          m("img.favoriteImage",{src: recipe.favoriteIcon, onclick: recipe.favoriteFunction})
          //oninit: (vnode) => {if (!('indexedDB' in window)) {vnode.attrs.className = "saved hidden";}}
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
        m("img.loadingImage",{src:"../assets/loading.gif"})
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
        m(".errorScreenText",errorThrown)
      ])
    ])
  }
}

export{homeScreen,loadScreen,errorScreen,recipeScreen,offlineScreen};
