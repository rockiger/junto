import ReactGA from 'react-ga'

export const initGA = trackingID => {
    try {
        ReactGA.initialize(trackingID)
    } catch (err) {}
}

export const PageView = () => {
    ReactGA.pageview(window.location.pathname + window.location.search)
}

/**
 * Event - Add custom tracking event.
 * @param {string} category
 * @param {string} action
 * @param {string} label
 */
export const Event = (category, action, label) => {
    ReactGA.event({
        category: category,
        action: action,
        label: label,
    })
}

export const setGA = fieldsObject => {
    ReactGA.set(fieldsObject)
}
