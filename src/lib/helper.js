import { EXTLENGTH } from './constants'

export function getTitleFromFileName(filename) {
    return filename.substr(0, filename.length - EXTLENGTH)
}

export function getExtFromFileName(filename) {
    return filename.substr(filename.length - EXTLENGTH)
}

export function debounce(func, wait, immediate) {
    var timeout
    return function() {
        var context = this,
            args = arguments
        var later = function() {
            timeout = null
            if (!immediate) func.apply(context, args)
        }
        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
}

export function isMobileDevice() {
    return (
        typeof window.orientation !== 'undefined' ||
        navigator.userAgent.indexOf('IEMobile') !== -1
    )
}
