const infoElem = document.getElementById('info');

// Change this with your firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBS9nB41rozDjuoYPpsm0BRdS7G0rsoueE",
  authDomain: "test-fcm-token.firebaseapp.com",
  projectId: "test-fcm-token",
  storageBucket: "test-fcm-token.appspot.com",
  messagingSenderId: "204145898436",
  appId: "1:204145898436:web:0481b16e7ae4e4a506aa91"
};

firebase.initializeApp(firebaseConfig);

function signUp(){
  var userEmail = document.getElementById("userEmail").value;
  var userPassword = document.getElementById("userPassword").value;
  var userEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;   
  var checkUserEmailValid = userEmail.match(userEmailFormate);
  if(checkUserEmailValid == null){
      alert("Failed");
  }else{
      firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then((success) => {
          alert('Your account was created successfully, you can log in now.');
          window.location.replace("./login.html");
      }).catch((error) => {
          var errorMessage = error.message;
          alert(errorMessage);
      });
  }
}


function signIn(){
  var userSIEmail = document.getElementById("userSIEmail").value;
  var userSIPassword = document.getElementById("userSIPassword").value;
  var userSIEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;   
  var checkUserEmailValid = userSIEmail.match(userSIEmailFormate);
  if(checkUserEmailValid == null){
    alert("Login failed");
  }else{
      firebase.auth().signInWithEmailAndPassword(userSIEmail, userSIPassword).then((success) => {
        window.location.replace("./profile.html");
      }).catch((error) => {
          var errorMessage = error.message;
          alert(errorMessage);
      });
  }
}

function signInGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().useDeviceLanguage();
  firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      var credential = result.credential;
      var token = credential.accessToken;
      var user = result.user;
      document.getElementById("userSIInfo").innerHTML = "Welcome Google. User " + user.email + " UUID " + user.uid + ". Token " + token;
      // Send user and token to BE
    }).catch((error) => {
      var errorMessage = error.message;
      alert(errorMessage);
    });
}

function signInFb() {
  var provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('email');
  firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      var credential = result.credential;
      var token = credential.accessToken;
      var user = result.user;
      document.getElementById("userSIInfo").innerHTML = "Welcome FB. User " + user.email + " UUID " + user.uid + ". Token " + token;
    })
    .catch((error) => {
      var errorMessage = error.message;
      alert(errorMessage);
    });
}

function signOut(){
  firebase.auth().signOut().then(function() {
    alert("Sign Out Successful");
    window.location.replace("./login.html");
  }).catch(function(error) {
      // An error happened.
      let errorMessage = error.message;
      alert(errorMessage);
  });
}