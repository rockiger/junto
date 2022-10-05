// @ts-check
import { EXT, EXTLENGTH, UNTITLEDNAME } from '../constants'

/**
 * Creates the title based on the name and the pageName-property of a file.
 *
 * @param {Object<string, any>} file - a fileobject form Google Drive
 *
 * @returns {string}
 */
export function getTitleFromFile(file) {
    return file?.title || UNTITLEDNAME
}

export function getExtFromFileName(filename) {
    return filename.substr(filename.length - EXTLENGTH)
}

export function getFileNameFromTitle(title) {
    return title + EXT
}

export function isMobileDevice() {
    return (
        typeof window.orientation !== 'undefined' ||
        navigator.userAgent.indexOf('IEMobile') !== -1
    )
}

export function isFolder(file) {
    return file.title.mimeType === 'application/vnd.google-apps.folder'
}

export function isPage(file) {
    return EXT === getExtFromFileName(file.title)
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
        return 0
    } else if (!date1 && date2) {
        return 1
    } else if (date1 && !date2) {
        return -1
        //@ts-ignore
    } else if (date1 < date2) {
        return 1
        //@ts-ignore
    } else if (date1 > date2) {
        return -1
    } else {
        return 0
    }
}
