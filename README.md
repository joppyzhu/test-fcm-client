# Open console firebase to get this data
- Firebase Config
- Server key

You can get this at: 
Project Settings -> Cloud Messaging -> Cloud Messaging API -> get server key
Project Settings -> Cloud Messaging -> General -> Your Apps -> Radio Button Config -> Get firebase config

# Fill the config at index.js
put the config at index.js

# Fill the config at firebase-messaging-sw.js
put the config at firebase-messaging-sw.js

# Run at localhost
- Run localhost with this project as the root folder
- Open terminal/cmd
- Go to your project folder
- Run this with python (or you can use others)
```
python: python -m SimpleHTTPServer 8000
```

# How to test
Open the localhost and get the Device token.

Execute this with curl:
```
curl -X POST -H "Authorization: key=<YOUR_SERVER_KEY>" -H "Content-Type: application/json" -d '{
  "notification": {
    "title": "Notification title",
    "body": "Notification body",
    "icon": "firebase-logo.png",
    "click_action": "http://localhost:8000"
  },
  "to": "<YOUR_CLIENT_DEVICE_TOKEN>"
}' "https://fcm.googleapis.com/fcm/send"
```
Notes: Dont forget to replace *<YOUR_SERVER_KEY>* with your key and *<YOUR_CLIENT_DEVICE_TOKEN>* with your client device token.

# How to push the code to firebase hosting
TBD