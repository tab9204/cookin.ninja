import {offlineScreen,loadScreen,recipeScreen} from './views.js';

window.onload = () =>{
  //set up the service worker once the page loads
  //if ('serviceWorker' in navigator) {navigator.serviceWorker.register('service-worker.js');}

  window.location = "#!/offline";//start the app on the main screen

  var root = document.body.children[0];


  m.route(root, "/offline",{
    "/offline": offlineScreen,
    "/load": loadScreen,
    "/recipe": recipeScreen
  })

}
