import { EditorContent } from '@tiptap/react'
import { FlexInput } from 'components/FlexInput'
import { Spinner } from 'components/gsuite-components'
import { Hint } from 'components/gsuite-components/hint'
import { PageButtons, ToggleReadOnlyButton } from 'components/pageButtons'
import { UNTITLEDNAME } from 'lib/constants'
import React from 'react'
import { BreadcrumbsBar } from './Breadcrumbs'
import s from './Page.module.scss'
import './Editor.scss'

/**
 * @param {{editorRef, titleInputRef}} ref A ref-object {editorRef, titleInputRef} with two references!
 */
const PageContainer = React.forwardRef(
    (
        {
            editor,
            error,
            isLoading,
            onBlurInput,
            onClickToggleButton,
            onChangeInput,
            onKeyDownInput,
            page,
            pageHead,
        },
        ref
    ) => {
        const { titleInputRef } = ref

        if (isLoading) {
            return <Spinner />
        }

        if (error) {
            //! Create better loading error.
            return <div>We couldn't load your wiki page: {error.message}</div>
        }

        return (
            <>
                <div className={s.page}>
                    <div className={s.editorContainer}>
                        <h1 className={s.editorHeader}>
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
                        <div>
                            <PageButtons>
                                <Hint id="edit_page" scope="wiki_page">
                                    <ToggleReadOnlyButton
                                        readOnly={!editor?.isEditable}
                                        onClick={onClickToggleButton}
                                    ></ToggleReadOnlyButton>
                                </Hint>
                            </PageButtons>
                            <EditorContent spellCheck={false} editor={editor} />
                        </div>
                    </div>
                </div>
            </>
        )
    }
)
export default PageContainer
