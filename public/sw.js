// Shows push notifications from Gamehelden, also when the site is closed.
self.addEventListener("push", (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch { d = { title: "Gamehelden", body: event.data ? event.data.text() : "" }; }
  const live = d.kind === "live";
  event.waitUntil(
    self.registration.showNotification(d.title || "Gamehelden", {
      body: d.body || "",
      icon: d.icon || "/icon-192.png",
      badge: "/badge.png",
      image: d.image || undefined, // the big thumbnail
      tag: d.tag || undefined,
      renotify: !!d.tag,
      timestamp: d.timestamp || Date.now(),
      vibrate: live ? [200, 100, 200, 100, 400] : [120, 60, 120],
      requireInteraction: live, // a live notification stays until you react
      actions: [{ action: "open", title: live ? "Kijk live" : "Bekijk video" }],
      data: { url: d.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      const same = wins.find((w) => w.url === url);
      if (same) return same.focus();
      return self.clients.openWindow(url);
    }),
  );
});
