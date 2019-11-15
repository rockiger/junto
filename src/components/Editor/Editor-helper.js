//@ts-check

/**
 *
 * @param {string} fileId
 * @param {object[]} files
 * @param {string} userEmail
 */
export function getUserRole(fileId, files, userEmail) {
    const fileMeta = files.find(file => file.id === fileId)

    /** @type {'organizer' | 'owner' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader'} */
    let userRole = 'reader'
    if (fileMeta && fileMeta.permissions) {
        const userPermission = fileMeta.permissions.find(
            el => el.emailAddress === userEmail
        )
        if (userPermission) userRole = userPermission.role
    }

    return userRole
}
