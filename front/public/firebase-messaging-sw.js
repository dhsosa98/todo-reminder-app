// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker
// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};

const firebaseConfig = {
    apiKey: "AIzaSyAJPbLN7c9soisWp3QtLkb35N5shVtZz4I",
    authDomain: "todo-list-59f9d.firebaseapp.com",
    projectId: "todo-list-59f9d",
    storageBucket: "todo-list-59f9d.appspot.com",
    messagingSenderId: "155629873861",
    appId: "1:155629873861:web:9521078ede67ad8d321eac"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
