import {homeScreen,loadScreen,errorScreen,recipeScreen} from './views.js';

window.onload = () =>{
  //set up the service worker once the page loads
  if ('serviceWorker' in navigator) {navigator.serviceWorker.register('service-worker.js');}

  window.location = "#!/home";//start the app on the main screen

  var root = document.body.children[0];


  m.route(root, "/home",{
    "/home": homeScreen,
    "/load": loadScreen,
    "/error": errorScreen,
    "/recipe": recipeScreen,
  })

}
