// @ts-check
import {
	EXT,
	EXTLENGTH,
	MYHOME,
	OVERVIEW_NAME,
	OVERVIEW_NAME_MD,
} from "../constants";

/**
 * Creates the title based on the name and the pageName-property of a file.
 *
 * @param {Object<string, any>} file - a fileobject form Google Drive
 *
 * @returns {string}
 */
export function getTitleFromFile(file) {
	const { name = "", properties = {} } = file;
	if (!name) return "";
	if (name === OVERVIEW_NAME || name === OVERVIEW_NAME_MD) {
		const { pageName } = properties;
		if (pageName) {
			return pageName;
		}
		return MYHOME;
	}

	// The title of a folder that acts as a root to a wiki
	if (properties.wikiRoot) return name;

	return name.substr(0, name.length - EXTLENGTH);
}

/** @param {string} filename */
export function getExtFromFileName(filename) {
	return filename.substr(filename.length - EXTLENGTH);
}

/** @param {string} title */
export function getFileNameFromTitle(title) {
	return title + EXT;
}

export function isMobileDevice() {
	return (
		typeof window.orientation !== "undefined" ||
		navigator.userAgent.indexOf("IEMobile") !== -1
	);
}

/** @param {import('reactn/default').IFile} file */
export function isFolder(file) {
	return file.mimeType === "application/vnd.google-apps.folder";
}

/** @param {import('reactn/default').IFile} file */
export function isPage(file) {
	return EXT === getExtFromFileName(file.name);
}

/**
 *
 * @param {string | undefined} date1 ISO String of a Date
 * @param {string | undefined} date2 ISO String of a Date
 *
 * @returns {number} indicates if date1 is smaller (-1), date2 is smaller (1), is equal (0)
 */
export function sortByDate(date1, date2) {
	if (!date1 && !date2) {
		return 0;
	} else if (!date1 && date2) {
		return 1;
	} else if (date1 && !date2) {
		return -1;
		//@ts-expect-error
	} else if (date1 < date2) {
		return 1;
		//@ts-expect-error
	} else if (date1 > date2) {
		return -1;
	} else {
		return 0;
	}
}
