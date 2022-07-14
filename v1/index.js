const TokenElem = document.getElementById('token');
const NotisElem = document.getElementById('notis');
const ErrElem = document.getElementById('err');

const firebaseConfig = {
  apiKey: "AIzaSyBS9nB41rozDjuoYPpsm0BRdS7G0rsoueE",
  authDomain: "test-fcm-token.firebaseapp.com",
  projectId: "test-fcm-token",
  storageBucket: "test-fcm-token.appspot.com",
  messagingSenderId: "204145898436",
  appId: "1:204145898436:web:0481b16e7ae4e4a506aa91"
};
firebase.initializeApp(firebaseConfig);

const firebaseMessaging = firebase.messaging();
firebaseMessaging
    .requestPermission()
    .then(function () {
        console.log('Notification permission granted.');
        return firebaseMessaging.getToken();
    })
    .then(function (token) {
        TokenElem.innerHTML = 'Device token is : <br>' + token;
    })
    .catch(function (err) {
        ErrElem.innerHTML = ErrElem.innerHTML + '; ' + err;
        console.log('Unable to get permission to notify.', err);
    });

let enableForegroundNotification = true;
firebaseMessaging.onMessage(payload => {
    console.log('Message received. ', payload);
    appendMessage(payload);
    if (enableForegroundNotification) {
        let notification = payload.notification;
        const notificationTitle = notification.title;
        const notificationOptions = {
          body: notification.body,
          icon: notification.icon
        };
        navigator.serviceWorker.getRegistrations().then((registration) => {
          registration[0].showNotification(notificationTitle, notificationOptions);
        });  

    }
});

function appendMessage(payload) {
  const messagesElement = document.querySelector('#notis');
  const dataHeaderElement = document.createElement('span');
  const dataElement = document.createElement('pre');
  dataElement.style = 'overflow-x:hidden;';
  dataHeaderElement.textContent = 'Received message:';
  dataElement.textContent = JSON.stringify(payload, null, 2);
  messagesElement.appendChild(dataHeaderElement);
  messagesElement.appendChild(dataElement);
}

function deleteToken() {
  clearMessages();
  TokenElem.innerHTML = "loading ...";
  // Delete registration token.
  firebaseMessaging.getToken().then((currentToken) => {
    firebaseMessaging.deleteToken(currentToken).then(() => {
      console.log('Token deleted.');
      firebaseMessaging.getToken().then(function (token) {
        TokenElem.innerHTML = 'Device token is : <br>' + token;
      });
    }).catch((err) => {
      console.log('Unable to delete token. ', err);
    });
  }).catch((err) => {
    console.log('Error retrieving registration token. ', err);
    ErrElem.innerHTML = ErrElem.innerHTML + 'Error retrieving registration token; ' + err + "<br/>";
  });
}

function clearMessages() {
  const messagesElement = document.querySelector('#notis');
  while (messagesElement.hasChildNodes()) {
    messagesElement.removeChild(messagesElement.lastChild);
  }
}

function doCopy() {
  let elementText = TokenElem.textContent;
  elementText = elementText.replace("Device token is : ","");
  navigator.clipboard.writeText(elementText).then(() => {
    alert("Copied the text: " + elementText);
  })
  .catch(() => {
    alert("something went wrong");
  });
  
}

function subscribeTopic() {
  firebaseMessaging.getToken().then(function (token) {
    firebaseMessaging.subscribeTopic(token, "jakarta").then((response) => {
      console.log('Successfully subscribed to topic:', response);
    })
    .catch((error) => {
      console.log('Error subscribing to topic:', error);
    });;
  });
}