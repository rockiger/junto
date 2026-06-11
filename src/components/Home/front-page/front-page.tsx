import { useCallback, useEffect } from "react"
import { Event, PageView } from "components/Tracking"
import { useGoogleAuth } from "lib/googleAuth"
import GoogleDriveLogo from "static/googleDriveLogo.svg"
import gsuiteIntegrations from "static/img/gsuite-integrations.png"
import instantSearch from "static/img/instant-search.png"
import page01 from "static/img/page01.webp"
import page02 from "static/img/page02.webp"
import { AndEndsInSuccess } from "./AndEndsInSuccess"
import { GoogleButton } from "./GoogleButton"
import { HasAPlan } from "./HasAPlan"
import { HasAProblem } from "./HasAProblem"
import { Testimonials } from "./Testimonials"

const imgShadow =
	"w-full max-w-full rounded-lg border border-[#eee] shadow-[0px_1px_8px_0px_rgba(0,0,0,0.2),0px_3px_4px_0px_rgba(0,0,0,0.14),0px_3px_3px_-2px_rgba(0,0,0,0.12)]"

export default function FrontPage() {
	const { signIn } = useGoogleAuth()

	const handleFrontpageSignIn = useCallback(
		(label: string) => {
			Event("Frontpage", "GoogleButton", label)
			signIn()
		},
		[signIn],
	)

	useEffect(() => {
		const prevTitle = document.title
		document.title = "Fulcrum.wiki - The knowledge base made for Google Drive"

		const body = document.body
		const prevOverflow = body.style.overflow
		const prevFontSize = body.style.fontSize
		body.style.overflow = "auto"
		body.style.fontSize = "1rem"

		const appMain = document.querySelector<HTMLElement>(".App-main")
		const prevAppMainPadding = appMain?.style.padding
		if (appMain) appMain.style.padding = "0"

		PageView({ pathname: "/frontpage" })

		return () => {
			document.title = prevTitle
			body.style.overflow = prevOverflow
			body.style.fontSize = prevFontSize
			if (appMain && prevAppMainPadding !== undefined) {
				appMain.style.padding = prevAppMainPadding
			}
		}
	}, [])

	return (
		<>
			<div
				id="front-page-hero"
				className="-mt-2 bg-[#f7f7f7] py-12 px-8 sm:py-20 sm:px-[6%]"
			>
				<div className="block mx-auto lg:-mx-6 lg:-mt-6 xl:flex lg:flex-row">
					<div className="col mx-auto flex flex-1 flex-col justify-center pb-6 space-y-6 lg:px-6">
						<h1 className="frontpage-header text-4xl my-6 leading-tight font-semibold">
							Effortless.
							<br />
							Organized.
							<br />
							<img
								alt=""
								className="bottom-px h-[40px] inline relative"
								src={GoogleDriveLogo}
							/>
							.
						</h1>
						<p>
							<b>Capture</b> knowledge. <b>Find</b> information faster.{" "}
							<b>Share</b> your ideas with others.
						</p>
						<p>
							Projects, Meeting notes, marketing plans - everything{" "}
							<b>saved in your Google Drive</b>.
						</p>
						<p className="lg:hidden">
							<img alt="Fulcrum Page" className={imgShadow} src={page01} />
						</p>
						<div className="flex items-center">
							<GoogleButton
								signIn={false}
								onClick={() => handleFrontpageSignIn("First")}
							/>
							<strong className="ml-1.5">- it&apos;s free!</strong>
						</div>
						<p>
							<b>Disclaimer:</b> We are still in beta.
						</p>
					</div>
					<div className="col mx-auto hidden flex-1 flex-col justify-center px-6 py-6 lg:flex lg:px-6">
						<img className={imgShadow} alt="Fulcrum Page" src={page01} />
					</div>
				</div>
			</div>
			<div className="fixed right-5 bottom-5 max-sm:hidden">
				<GoogleButton
					onClick={() => handleFrontpageSignIn("Floating")}
				/>
			</div>
			<HasAProblem />
			<AndEndsInSuccess />
			<div className="my-12 px-[6%] sm:my-32">
				<div
					style={{ marginLeft: "auto", marginRight: "auto" }}
					className="mx-auto flex max-w-7xl flex-col lg:-mx-6 lg:-mt-6 lg:flex-row"
				>
					<div className="col mx-auto flex flex-1 flex-col justify-center px-6 py-6 lg:px-6">
						<img alt="" className={imgShadow} src={page02} />
					</div>
					<div className="col mx-auto flex flex-1 flex-col justify-center px-6 py-6 space-y-4 lg:px-6">
						<h2 className="frontpage-header max-w-[45rem] text-[42px] leading-tight font-medium max-sm:text-3xl">
							Build great looking pages - all saved in your Google Drive
						</h2>
						<p>
							Create pages with <strong>all content formats</strong> you need.
							Tables, Images, Lists - you name it. Write a new marketing plan,
							document your workflow for employee onboarding or write a memo for
							your co-workers.
						</p>
						<p>
							The best is: <strong>Everything stays on your Drives</strong>.
							Unlike other tools, we don&apos;t introduce a new SaaS
							infrastructure to your business. All the content you create is
							saved on your Drives.{" "}
							<strong>Nothing is saved on our servers.</strong>
						</p>
					</div>
				</div>
			</div>
			<div className="my-12 px-[6%] sm:my-32">
				<div
					style={{ marginLeft: "auto", marginRight: "auto" }}
					className="mx-auto flex max-w-7xl flex-col lg:-mx-6 lg:-mt-6 lg:flex-row"
				>
					<div className="col mx-auto flex flex-1 flex-col justify-center px-6 py-6 space-y-4 lg:px-6">
						<h2 className="frontpage-header max-w-180 text-3xl leading-tight font-medium max-sm:text-3xl">
							Easily find & navigate your work
						</h2>
						<p>
							Always stay on top of your work. Organize your{" "}
							<strong>work in different Drives</strong> and create sub-pages of
							your work. Access your most recent and important work instantly.
						</p>
						<p>
							<strong>Don&apos;t waste your time</strong>
							searching. Find what you are looking for with a powerful search -
							just like you expect from any other Google product.
						</p>
						<img
							alt="Search"
							className="max-w-[645px] w-full"
							src={instantSearch}
						/>
					</div>
					<div className="col mx-auto flex flex-1 flex-col justify-start px-6 py-6 space-y-4 lg:px-6">
						<h2 className="frontpage-header max-w-180 text-3xl leading-tight font-medium max-sm:text-3xl">
							Work seamlessly with your G Suite
						</h2>
						<p>
							Fulcrum allows you to <strong>connect</strong> your{" "}
							<strong>pages with other G Suite applications</strong>. Insert
							your photos into your pages. Open documents, presentation and
							spreadsheets directly from your pages. Share them with your
							co-workers.
						</p>
						<p>
							Everything is tightly integrated. We even stick to Google&apos;s
							design guidelines that you and your team-mates are{" "}
							<strong>productive instantly</strong>.
						</p>

						<img
							alt="Share pages"
							className={`max-w-[643px] ${imgShadow}`}
							src={gsuiteIntegrations}
						/>
					</div>
				</div>
			</div>
			<Testimonials />
			<HasAPlan />
			<div className="mb-20 flex flex-col items-center">
				<GoogleButton
					onClick={() => handleFrontpageSignIn("HasAPlan")}
				/>
			</div>
		</>
	)
}
