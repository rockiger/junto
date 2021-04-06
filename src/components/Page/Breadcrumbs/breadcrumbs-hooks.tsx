import _ from 'lodash'
import { useEffect, useGlobal, useState } from 'reactn'
import { IFile, IFileOrNull } from 'reactn/default'

import { getChildren, getMetaById, getParents } from './Breadcrumbs-helper'

export const useBreadcrumbs = (fileId) => {
  const [files] = useGlobal('initialFiles')
  const [childPages, setChildren] = useState<IFile[]>([])
  const [file, setFile] = useState<IFileOrNull>(null)
  const [parentPages, setParents] = useState<Array<{file: IFile, children: IFile[]}>>([])

  useEffect(() => {
      if (fileId && files.length > 0) {
          setFile(getMetaById(fileId, files))
      }
  }, [fileId, files])

  useEffect(() => {
      if (file && files.length > 0) {
          _.thread(file,
            [getParents, files],
            [_.map, el => ({
                file: el,
                children: getChildren(el, files)
              })],
          setParents)
      }
  }, [file, files])

  useEffect(() => {
    if (!_.isNull(file)) {
    setChildren(getChildren(file, files))
    }
  }, [file, files])

  return { parentPages, childPages}
}