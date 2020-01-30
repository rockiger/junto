// @ts-check
import { EXT, EXTLENGTH, MYHOME, OVERVIEW_NAME } from '../constants'

/**
 * Creates the title based on the name and the pageName-property of a file.
 *
 * @param {Object<string, any>} file - a fileobject form Google Drive
 *
 * @returns {string}
 */
export function getTitleFromFile(file) {
    const { name = '', properties = {} } = file
    if (!name) return ''
    if (name === OVERVIEW_NAME) {
        const { pageName } = properties
        if (pageName) {
            return pageName
        }
        return MYHOME
    }

    // The title of a folder that acts as a root to a wiki
    if (properties.wikiRoot) return name

    return name.substr(0, name.length - EXTLENGTH)
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

/**
 *
 * @param {string} date1 ISO String of a Date
 * @param {string} date2 ISO String of a Date
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
    } else if (date1 < date2) {
        return 1
    } else if (date1 > date2) {
        return -1
    } else {
        return 0
    }
}
