/*self.addEventListener("install", (event) => {
    console.log("[SW.JS] Step 2, Service worker has been installllled");
   });
   self.addEventListener("activate", (event) => {
    console.log("[SW.JS] Step 2, Service worker has been actiaaavated");
});*/

self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon,
      badge: data.badge
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  