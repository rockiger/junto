import { EXT, OVERVIEW_NAME } from '../../../lib/constants'

export function getFolderId(fileId, files) {
    const folder = files.find(file => file.name === fileId)
    return folder ? folder.id : null
}

export function getOverviewFileId(files) {
    const overview = files.find(file => file.name === OVERVIEW_NAME)
    if (overview) return overview.id
    return ''
}
export function filterChildFiles(folderId, files) {
    if (folderId) return files.filter(file => file.parents.includes(folderId))
    return []
}

export function shouldFileDisplay(file, parentId) {
    const { mimeType, name, parents, trashed } = file
    return (
        mimeType === 'application/json' &&
        name !== OVERVIEW_NAME &&
        name.endsWith(EXT) &&
        parents.includes(parentId) &&
        trashed === false
    )
}

export function sortFilesByName(files) {
    return files.sort((a, b) => {
        if (a.name < b.name) {
            return -1
        }
        if (a.name > b.name) {
            return 1
        }
        return 0
    })
}
