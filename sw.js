importScripts(
	"https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js"
);

if (workbox) {
	workbox.core.setCacheNameDetails({
		prefix: "tomasalabes-me",
		suffix: "v1"
	});

	workbox.googleAnalytics.initialize();

	workbox.routing.registerRoute(
		new RegExp("https://fonts.(?:googleapis|gstatic).com/(.*)"),
		workbox.strategies.cacheFirst({
			cacheName: "google-fonts",
			plugins: [
				new workbox.expiration.Plugin({
					maxEntries: 30
				}),
				new workbox.cacheableResponse.Plugin({
					statuses: [0, 200]
				})
			]
		})
	);

	workbox.routing.registerRoute(
		/\.(?:png|gif|jpg|jpeg|svg)$/,
		workbox.strategies.cacheFirst({
			cacheName: "images",
			plugins: [
				new workbox.expiration.Plugin({
					maxEntries: 60,
					maxAgeSeconds: 60 * 24 * 60 * 60 // 30 Days
				})
			]
		})
	);

	workbox.routing.registerRoute(
		/\.(?:js|css)$/,
		workbox.strategies.staleWhileRevalidate({
			cacheName: "static-resources"
		})
	);
}
