// serviceWorkerRegistration.js

export function register() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js") // Path to your service worker file
        .then(() => {})
        .catch((error) => {
          console.error("Error registering service worker:", error);
        });
    });
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error("Error unregistering service worker:", error);
      });
  }
}
