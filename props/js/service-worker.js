self.addEventListener('install', event => {
	console.log('Service Worker installing.');
});

self.addEventListener('activate', event => {
	console.log('Service Worker activated.');
});

self.addEventListener('push', event => {
	const data = event.data.json();
	const options = {
		body: data.body,
		icon: 'https://gacelabs.github.io/mcgi-mass-indoc-invite/props/images/logo.png'
	};
	event.waitUntil(
		self.registration.showNotification(data.title, options)
	);
});

self.addEventListener('notificationclick', event => {
	// Add custom behavior for when the notification is clicked, if needed.
	e.waitUntil(
		clients.matchAll({ type: "window" }).then((clientsArr) => {
			// If a Window tab matching the targeted URL already exists, focus that;
			const hadWindowToFocus = clientsArr.some((windowClient) =>
				windowClient.url === event.notification.data.redirectUrl
				? (windowClient.focus(), true)
				: false,
			);
			// Otherwise, open a new tab to the applicable URL and focus it.
			if (!hadWindowToFocus)
				clients
				.openWindow(event.notification.data.redirectUrl)
				.then((windowClient) => (windowClient ? windowClient.focus() : null));
		}),
	);

	event.notification.close();
});
