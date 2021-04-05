import _ from 'lodash'
import { useEffect, useGlobal, useState } from 'reactn'
import { IFile, IFileOrNull } from 'reactn/default'

import { getChildren, getMetaById, getParents } from './Breadcrumbs-helper'

export const useBreadcrumbs = (fileId) => {
  const [files] = useGlobal('initialFiles')
  const [file, setFile] = useState<IFileOrNull>(null)
  const [parents, setParents] = useState<Array<{file: IFile, children: IFile[]}>>([])

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

  return { parents }
}