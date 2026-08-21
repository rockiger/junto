import type { RegisteredRouter } from "@tanstack/react-router";

function isTrackingEnabled() {
	return !import.meta.env.DEV && typeof window.gtag === "function";
}

function gtag(...args: unknown[]) {
	window.gtag?.(...args);
}

export function pageView(path: string) {
	if (!isTrackingEnabled()) return;

	gtag("event", "page_view", {
		page_title: document.title,
		page_location: window.location.href,
		page_path: path,
	});
}

/**
 * Track a custom event (keeps the legacy `Event` API used across the app).
 */
export function Event(category: string, action: string, label?: string) {
	if (!isTrackingEnabled()) return;

	gtag("event", action, {
		event_category: category,
		...(label ? { event_label: label } : {}),
	});
}

export function setupRouterPageTracking(router: RegisteredRouter) {
	if (!isTrackingEnabled()) return () => {};

	// Initial page_view is sent by the gtag `config` call in index.html.
	return router.subscribe("onResolved", (event) => {
		if (event.pathChanged) {
			const { pathname, searchStr } = event.toLocation;
			pageView(`${pathname}${searchStr}`);
		}
	});
}
