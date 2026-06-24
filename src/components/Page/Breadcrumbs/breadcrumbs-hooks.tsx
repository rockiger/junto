import _ from 'lib/helper/globals'
import { useEffect, useState } from 'react'
import { useAppStore } from 'store/app-store'
import { IFile, IFileOrNull } from 'types/app-state'

import { getChildren, getMetaById, getParents } from './Breadcrumbs-helper'

export const useBreadcrumbs = (fileId: string) => {
  const files = useAppStore((s) => s.initialFiles)
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
            [_.map, (el: IFile) => ({
                file: el,
                children: getChildren(el, files)
              })],
          setParents)
      }
  }, [file, files])

  useEffect(() => {
    if (file) {
    setChildren(getChildren(file, files))
    }
  }, [file, files])

  return { parentPages, childPages}
}