//import { postData } from "./core/API/api-service";

import firebase from "firebase/compat/app";
import "firebase/compat/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyB4WrwS_RDWo2LruSGBOGdzt-VvGA5vY48",
//   authDomain: "lynns-roshnroys.firebaseapp.com",
//   projectId: "lynns-roshnroys",
//   storageBucket: "lynns-roshnroys.appspot.com",
//   messagingSenderId: "425315482543",
//   appId: "1:425315482543:web:45966f7200b0bd99f9cd5a",
//   measurementId: "G-8253D7HP6M",
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

// firebase.initializeApp(firebaseConfig);

// let messaging = null;

// if (firebase.messaging.isSupported()) {
//   messaging = firebase.messaging();
// }

// const publicKey =
//   "BCio5hag3yhIH-xww1SLgakRsC4zlvs5TWfmazbogkf1raJ9JSZW8vPU0xmXIhlRnLhwk6q3u4EiNvoQMwSBPHc";

// export const getToken = async (setTokenFound) => {
//   let currentToken = "";

//   try {
//     Notification.requestPermission().then(async () => {});
//     currentToken = await messaging.getToken({ vapidKey: publicKey });
//     if (currentToken) {
//       localStorage.setItem("fcmToken", currentToken);

//       setTokenFound(true);
//     } else {
//       setTokenFound(false);
//     }
//   } catch (error) {
//     //
//   }

//   return currentToken;
// };

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     messaging.onMessage((payload) => {
//       resolve(payload);
//     });
//   });


firebase.initializeApp(firebaseConfig);

let messaging = null;

if (firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
} else {
  console.warn("Firebase messaging is not supported on this browser.");
}

const publicKey = "BCio5hag3yhIH-xww1SLgakRsC4zlvs5TWfmazbogkf1raJ9JSZW8vPU0xmXIhlRnLhwk6q3u4EiNvoQMwSBPHc";

export const getToken = async (setTokenFound) => {
  let currentToken = "";

  try {
    if (messaging) {
      await Notification.requestPermission();
      currentToken = await messaging.getToken({ vapidKey: publicKey });
      if (currentToken) {
        localStorage.setItem("fcmToken", currentToken);
        setTokenFound(true);
      } else {
        setTokenFound(false);
      }
    } else {
      setTokenFound(false);
      console.warn("Messaging is not available.");
    }
  } catch (error) {
    console.error("An error occurred while retrieving the token:", error);
  }

  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    if (messaging) {
      messaging.onMessage((payload) => {
        resolve(payload);
      });
    } else {
      console.warn("Messaging is not available for onMessageListener.");
      reject(console.log("Messaging is not supported."));
    }
  });
