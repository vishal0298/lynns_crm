/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// const firebaseConfig = {
//   apiKey: "AIzaSyB4WrwS_RDWo2LruSGBOGdzt-VvGA5vY48",
//   authDomain: "lynns-roshnroys.firebaseapp.com",
//   projectId: "lynns-roshnroys",
//   storageBucket: "lynns-roshnroys.appspot.com",
//   messagingSenderId: "425315482543",
//   appId: "1:425315482543:web:45966f7200b0bd99f9cd5a",
//   measurementId: "G-8253D7HP6M"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCq7m2NBAL9eWbTDkg8a3dzfiYv3sUn034",
  authDomain: "billingapp-5661a.firebaseapp.com",
  projectId: "billingapp-5661a",
  storageBucket: "billingapp-5661a.appspot.com",
  messagingSenderId: "155141215679",
  appId: "1:155141215679:web:6058089be4f1758b2a3d0a",
  measurementId: "G-6KQ0335JCV"
};

firebase.initializeApp(firebaseConfig);

let messaging = null;

if (firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
}

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicaon.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
