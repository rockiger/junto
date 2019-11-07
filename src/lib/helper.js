// @ts-check
import { EXTLENGTH, MYHOME, OVERVIEW_NAME } from './constants'

export function getTitleFromFileName(filename) {
    if (filename === OVERVIEW_NAME) return MYHOME
    return filename.substr(0, filename.length - EXTLENGTH)
}

export function getExtFromFileName(filename) {
    return filename.substr(filename.length - EXTLENGTH)
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
