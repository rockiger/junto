import _ from 'lodash'
import { useEffect, useGlobal, useState } from 'reactn'
import { IFile, IFileOrNull } from 'reactn/default'

import { getChildren, getMetaById } from './Breadcrumbs-helper'

export const useBreadcrumbs = fileId => {
    const [files] = useGlobal('initialFiles')
    const [childPages, setChildren] = useState<IFile[]>([])
    const [file, setFile] = useState<IFileOrNull>(null)
    const [parentPages, setParents] = useState<
        Array<{ file: IFile; children: IFile[] }>
    >([])

    useEffect(() => {
        if (fileId && files.length > 0) {
            setFile(getMetaById(fileId, files))
        }
    }, [fileId, files])

    useEffect(() => {
        const parentFile = getMetaById(_.get(file, 'parentId', ''), files)
        if (parentFile && files.length > 0) {
            setParents([
                {
                    file: parentFile,
                    children: getChildren(parentFile, files).filter(
                        child => child.id !== file?.id
                    ),
                },
            ])
        }
    }, [file, files])

    useEffect(() => {
        if (!_.isNull(file)) {
            setChildren(getChildren(file, files))
        }
    }, [file, files])

    return { parentPages, childPages }
}
