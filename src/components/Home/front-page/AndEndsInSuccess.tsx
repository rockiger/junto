import type { MdiReactIconComponentType } from "mdi-react"
import BookPlusMultipleIcon from "mdi-react/BookPlusMultipleIcon"
import ClipboardCheckIcon from 'mdi-react/ClipboardCheckIcon'
import MessageQuestionIcon from 'mdi-react/MessageQuestionIcon'
import type { ReactNode } from "react"

function Reason({
	children,
	headline,
	icon: Icon,
}: {
	children: ReactNode
	headline: string
	icon: MdiReactIconComponentType
}) {
	return (
		<div className="col mx-auto flex max-w-md flex-col items-center px-6 py-6">
			<div className="mt-12 flex h-24 w-24 items-center justify-center rounded-full border-4 border-icon-blue">
				<Icon aria-hidden className="h-12 w-12 text-icon-blue" />
			</div>
			<h3 className="mt-8 text-center text-2xl">{headline}</h3>
			<p className="mt-2 text-center">{children}</p>
		</div>
	)
}

export function AndEndsInSuccess() {
	return (
		<div className="bg-pub-surface max-lg:px-4">
			<div className="mx-auto max-w-7xl py-12 px-8 sm:py-20 sm:px-[6%] lg:px-0">
				<div className="flex flex-col items-center">
					<h2 className="frontpage-header mx-auto mb-8 mt-0 max-w-180 text-center text-[42px] leading-tight font-medium  max-sm:text-3xl">
						Manage your knowledge.
						<br />
						Have your records always ready.
					</h2>
					<p className="mx-auto mb-8 max-w-3xl text-center">
						Fulcrum pages are{" "}
						<strong>Markdown with a clear meta section</strong> — the format AI
						tools understand best. Instead of re-reading your files from scratch
						every time, your AI can{" "}
						<strong>build and maintain a living wiki</strong> that gets richer
						with every source you add and every question you ask.
					</p>
				</div>
				<div className="mx-auto flex max-w-7xl flex-col lg:-mx-6 lg:-mt-6 lg:flex-row">
					<Reason headline="Capture Knowledge" icon={BookPlusMultipleIcon}>
						Drop in an article, meeting notes, or a report. Your AI{" "}
						<strong>reads it, pulls out what matters</strong>, and weaves it into
						your wiki, updating related pages as it goes - <strong>all in your Google Drive</strong>.
					</Reason>
					<Reason headline="Ask questions that stick" icon={MessageQuestionIcon}>
						Ask against your wiki and get{" "}
						<strong>clear answers with sources</strong>. Save useful insights as
						new pages — so every exploration makes your knowledge base richer.
					</Reason>
					<Reason headline="Keep your knowledge sharp" icon={ClipboardCheckIcon}>
						Ask your AI to check for{" "}
						<strong>outdated facts, missing links, or contradictions</strong>.
						Your knowledge base stays reliable as it grows — without the bookkeeping burden
						on you.
					</Reason>
				</div>
			</div>
		</div>
	)
}
