importScripts("https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js");
importScripts("https://www.gstatic.com/firebasejs/7.16.1/firebase-analytics.js",);

const firebaseConfig = {
  apiKey: "AIzaSyBS9nB41rozDjuoYPpsm0BRdS7G0rsoueE",
  authDomain: "test-fcm-token.firebaseapp.com",
  projectId: "test-fcm-token",
  storageBucket: "test-fcm-token.appspot.com",
  messagingSenderId: "204145898436",
  appId: "1:204145898436:web:0481b16e7ae4e4a506aa91"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
});