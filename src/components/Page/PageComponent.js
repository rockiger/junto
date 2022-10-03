import { FlexInput } from 'components/FlexInput'
import { Spinner } from 'components/gsuite-components'
import { UNTITLEDNAME } from 'lib/constants'
import React from 'react'
import { BreadcrumbsBar } from './Breadcrumbs'
import s from './Page.module.scss'

/**
 * @param {{editorRef, titleInputRef}} ref A ref-object {editorRef, titleInputRef} with two references!
 */
const PageContainer = React.forwardRef(
    ({ onBlurInput, onChangeInput, onKeyDownInput, page, pageHead }, ref) => {
        const { editorRef, titleInputRef } = ref

        if (page === null) {
            return <Spinner />
        }
        return (
            <>
                <div className={s.page}>
                    <div className={s.editorContainer}>
                        <h1 className={s.editorHeader}>
                            {/* //! */}
                            <BreadcrumbsBar fileId={page.id}>
                                <FlexInput
                                    id="editorInput"
                                    onBlur={onBlurInput}
                                    value={
                                        pageHead !== UNTITLEDNAME
                                            ? pageHead
                                            : ''
                                    }
                                    placeholder={UNTITLEDNAME}
                                    ref={titleInputRef}
                                    onChange={onChangeInput}
                                    onKeyDown={onKeyDownInput}
                                />
                            </BreadcrumbsBar>
                        </h1>
                        <div>{page.body}</div>
                    </div>
                </div>
            </>
        )
    }
)
export default PageContainer
