const TokenElem = document.getElementById('token');
const NotisElem = document.getElementById('notis');
const ErrElem = document.getElementById('err');

// Change this with your firebase config
const firebaseConfig = {
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