import type { RegisteredRouter } from "@tanstack/react-router";

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? "";

function isTrackingEnabled() {
	return Boolean(MEASUREMENT_ID) && !import.meta.env.DEV;
}

function gtag(...args: unknown[]) {
	window.dataLayer?.push(args);
}

export function initGA() {
	if (!isTrackingEnabled()) return;

	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
	document.head.appendChild(script);

	window.dataLayer = window.dataLayer ?? [];
	window.gtag = gtag;

	gtag("js", new Date());
	gtag("config", MEASUREMENT_ID, {
		anonymize_ip: true,
		send_page_view: false,
	});
}

export function pageView(path: string) {
	if (!isTrackingEnabled()) return;

	gtag("event", "page_view", {
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

	const trackCurrentLocation = () => {
		const { pathname, searchStr } = router.state.location
		pageView(`${pathname}${searchStr}`)
	}

	trackCurrentLocation()

	return router.subscribe("onResolved", (event) => {
		if (event.pathChanged) {
			const { pathname, searchStr } = event.toLocation
			pageView(`${pathname}${searchStr}`)
		}
	})
}
