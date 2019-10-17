export function isPage(location) {
    if (location.pathname.startsWith('/page/')) return true
    return false
}

export function getPageId(location) {
    const path = location.pathname
    return path.slice('/page/'.length)
}

export function getParentFolderId(pageId, files) {
    const file = files.find(f => f.id === pageId)
    return file.parents[0]
}

export function getIdByName(name, files) {
    const file = files.find(f => f.name === name)
    return file ? file.id : ''
}
