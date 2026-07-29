import { Event } from "components/Tracking"
import { useGoogleAuth } from "lib/googleAuth"
import assistant from "static/img/assistant_small.webp"
import { GoogleButton } from "./GoogleButton"

export function HasAProblem() {
	const { signIn } = useGoogleAuth()

	return (
		<div className="mx-auto -mt-2 max-w-7xl py-12 px-8 sm:py-20 sm:px-[6%]">
			<div className="mx-auto flex items-center max-w-7xl flex-col lg:-mx-6 lg:-mt-6 lg:flex-row">
				<div className="contents mx-auto max-w-[640px] grow-1 shrink-0 flex-col justify-center py-6 space-y-4 text-center lg:flex lg:px-6 lg:text-left">
					<h2 className="text-2xl font-medium order-1">
						Your knowledge management should make you look smart.</h2>
					<h2 className="text-2xl font-medium order-1"> Like an
						assistant that always has your back.
					</h2>
					<p className="order-3">Have you felt frustrated by your note-taking app?</p>
					<ul className="mt-0 list-disc order-3 pl-6 text-left">
						<li>Did you endlessly look for a note you have written?</li>
						<li>Created time-consuming documents nobody looked at again?</li>
						<li>Google Keep™ is too simplistic for your ideas?</li>
						<li>
							Think Google Docs™ sucks for reading and organizing your
							team&apos;s knowledge?
						</li>
						<li>Never came back to that great idea you wrote down?</li>
					</ul>
					<GoogleButton className="order-3 mt-4 w-fit"
						onClick={() => {
							Event("Frontpage", "GoogleButton", "HasAProblem")
							signIn()
						}}
					/>
				</div>
				<div className="mx-auto flex grow-0 shrink flex-col justify-center px-6 py-6 order-2 md:flex-row lg:px-6 lg:max-w-[35%]">
					<img
						alt="Fulcrum Page"
						className="w-full max-w-md rounded-lg border border-[#eee] shadow-[0px_1px_8px_0px_rgba(0,0,0,0.2),0px_3px_4px_0px_rgba(0,0,0,0.14),0px_3px_3px_-2px_rgba(0,0,0,0.12)]"
						src={assistant}
					/>
				</div>
			</div>
		</div>
	)
}
