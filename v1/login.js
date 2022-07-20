// Change this with your firebase config

const apiUrl = "http://localhost:8080/";
const firebaseConfig = {
  apiKey: "AIzaSyBS9nB41rozDjuoYPpsm0BRdS7G0rsoueE",
  authDomain: "test-fcm-token.firebaseapp.com",
  projectId: "test-fcm-token",
  storageBucket: "test-fcm-token.appspot.com",
  messagingSenderId: "204145898436",
  appId: "1:204145898436:web:0481b16e7ae4e4a506aa91"
};

firebase.initializeApp(firebaseConfig);

// REGISTER
function signUp(){
  var userEmail = document.getElementById("userEmail").value;
  var userPassword = document.getElementById("userPassword").value;
  var userEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;   
  var checkUserEmailValid = userEmail.match(userEmailFormate);
  if(checkUserEmailValid == null){
      alert("Failed");
  }else{
      firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then((success) => {
          firebase.auth().currentUser.sendEmailVerification().then(() => {
              alert("Register success. Please verify your email.");
              window.location.replace("./verify.html");
          }).catch((error) => {
            var errorMessage = error.message;
            alert(errorMessage);
          });
      }).catch((error) => {
          var errorMessage = error.message;
          alert(errorMessage);
      });
  }
}

// RESEND VERIFY EMAIL
function resend() {
  firebase.auth().currentUser.sendEmailVerification().then(() => {
      alert("Please verify your email first");
      window.location.replace("./verify.html");
  }).catch((error) => {
      var errorMessage = error.message;
      alert(errorMessage);
  });
}

// LOGIN WITH EMAIL
function signIn(){
  var userSIEmail = document.getElementById("userSIEmail").value;
  var userSIPassword = document.getElementById("userSIPassword").value;
  var userSIEmailFormate = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;   
  var checkUserEmailValid = userSIEmail.match(userSIEmailFormate);
  if(checkUserEmailValid == null){
    alert("Email wrong format");
  }else{
      firebase.auth().signInWithEmailAndPassword(userSIEmail, userSIPassword).then((result) => {
        if (result.user.emailVerified) {
          var credential = result.user.toJSON().stsTokenManager;
          var token = credential.accessToken;
          $.ajax({
            type: "POST",
            url: apiUrl + "auth/v1/login",
            headers: {
              "Authorization": "Bearer " + token,
              "device-id": getCookie("deviceId"),
              "login-type":"EMAIL"
            } 
          }).done(function(response) {
              handleLogin(response);
          });
        } else {
          window.location.replace("./verify.html");
        }
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
      var credential = result.user.toJSON().stsTokenManager;
      var token = credential.accessToken;
      $.ajax({
        type: "POST",
        url: apiUrl + "auth/v1/login",
        headers: {
          "Authorization": "Bearer " + token,
          "device-id": getCookie("deviceId"),
          "login-type":"GOOGLE"
        } 
      }).done(function(response) {
        handleLogin(response);
      });
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
      if (result.user.emailVerified) {
        const user = firebase.auth().currentUser;
        user.updateProfile({
          emailVerified: "true"
        })
      }
      var credential = result.user.toJSON().stsTokenManager;
      var token = credential.accessToken;
      $.ajax({
        type: "POST",
        url: apiUrl + "auth/v1/login",
        headers: {
          "Authorization": "Bearer " + token,
          "device-id": getCookie("deviceId"),
          "login-type":"FACEBOOK"
        } 
      }).done(function(response) {
        handleLogin(response);
      });
    })
    .catch((error) => {
      var errorMessage = error.message;
      alert(errorMessage);
    });
}

function completeProfile() {
  $.ajax({
    type: "POST",
    url: apiUrl + "auth/v1/register",
    headers: {
      "Authorization": "Bearer " + getCookie("accessToken")
    },
    data: {
      displayName: document.getElementById("userDisplayName").value,
      username: document.getElementById("userUsername").value,
      phone: document.getElementById("userPhone").value
    }
  }).done(function(response) {
      if (response.responseCode == "5000") {
        alert(response.message);
      } else {
        alert("Thank you.");
        window.location.replace("./profile.html");
      }
  }).fail(function(response) {
    var httpResponse = response.responseJSON.code;
    if (httpResponse == "401") {
      // refresh token
    }
  });
}

function handleLogin(response) {
  if (response.responseCode == "5000") {
    alert("Error " + response.message);
    window.location.replace("./login.html");
  } else if (response.responseCode == "5001") {
    window.location.replace("./init.html");
  } else if (response.responseCode == "5002") {
    window.location.replace("./verify.html")
  } else {
    firebase.auth().signInWithCustomToken(response.accessToken).then((userCredential) => {
      var newCredential = userCredential.user.toJSON().stsTokenManager;
      setCookie("accessToken", newCredential.accessToken);
      setCookie("refreshToken", newCredential.refreshToken);
      if (response.responseCode == "5002") {
        window.location.replace("./verify.html");
      } else if (response.responseCode == "5003") {
        window.location.replace("./complete-profile.html");
      } else {
        window.location.replace("./profile.html");
      }
    })
    .catch((error) => {
      var errorMessage = error.message;
      alert(errorMessage);
    });
  } 
}

function signOut(){
  firebase.auth().signOut().then(function() {
    $.ajax({
      type: "POST",
      url: apiUrl + "auth/v1/logout",
      headers: {
        "Authorization": "Bearer " + getCookie("accessToken")
      } 
    }).done(function(response) {
      console.log(printObj(response));
      eraseCookie("accessToken");
      eraseCookie("refreshToken");
      alert("See you");
      window.location.replace("./login.html");
    });
  }).catch(function(error) {
      let errorMessage = error.message;
      alert(errorMessage);
  }); 
}

function resetPassword() {
  var email = document.getElementById("userEmail").value;
  firebase.auth().sendPasswordResetEmail(email).then(() => {
    alert("success. please check your email.");
    window.location.replace("./login.html");
  })
  .catch((error) => {
    let errorMessage = error.message;
    alert(errorMessage);
  });
}

function printObj(obj) {
  return JSON.stringify(obj);
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
      c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
      }
  }
  return "";
}

function eraseCookie(name) {   
  document.cookie = name+'=; Max-Age=-99999999;';  
}