import FileDocumentIcon from "mdi-react/FileDocumentIcon"
import GoogleKeepIcon from "mdi-react/GoogleKeepIcon"
import logo from "static/logo.svg"

export function WhyFulcrum() {
	return (
		<div className="mx-auto max-w-6xl px-4">
			<h2 className="frontpage-header mx-auto my-20 text-center text-[42px] leading-tight font-medium max-sm:text-3xl">
				Why Fulcrum?
			</h2>
			<div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
				<div className="flex flex-col items-center text-center">
					<GoogleKeepIcon
						aria-hidden
						className="h-16 w-16 shrink-0 text-black/55"
					/>
					<p className="mt-4">
						When we started with G Suite we were looking for a solution to{" "}
						<strong>create our knowledge base</strong>. We first tested{" "}
						<strong>Keep</strong>. Though it&apos;s great for taking notes,
						it&apos;s much
						<strong> too simplistic to create compelling documentation </strong>
						for your work.{" "}
					</p>
				</div>
				<div className="flex flex-col items-center text-center">
					<FileDocumentIcon
						aria-hidden
						className="h-16 w-16 shrink-0 text-black/55"
					/>
					<p className="mt-4">
						We then switched to <strong>Docs</strong> - which is{" "}
						<strong>a great word processor</strong>! Maybe the best we ever
						used. For <strong>reading and finding</strong> information on the
						other hand it is a real pain. It&apos;s very cumbersome to create an
						information structure with Docs and the l
						<strong>oading of documents takes ages</strong> if you just want to
						look up something.{" "}
						<strong>It is made for writing, not reading.</strong>
					</p>
				</div>
				<div className="flex flex-col items-center text-center">
					<img alt="Fulcrum Logo" className="h-16 w-auto shrink-0" src={logo} />
					<p className="mt-4">
						After this experience we started to build Fulcrum.{" "}
						<strong>It fits right in there.</strong> It is the missing link
						between Keep and Docs. Create{" "}
						<strong>powerful documentation</strong> right in your personal
						Google Drive or collaborate <strong>with your team</strong> on a
						shared Drive.
					</p>
				</div>
			</div>
		</div>
	)
}
