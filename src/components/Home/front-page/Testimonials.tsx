import henryLevins from "static/img/Henry_Levins.jpg"

export function Testimonials() {
	return (
		<div className="bg-[#4285F4] px-8 py-20 text-white">
			<div className="mx-auto flex max-w-3xl flex-col items-center text-center">
				<div className="h-32 w-32 overflow-hidden rounded-full">
					<img
						alt="Henry Levins"
						className="h-full w-full object-cover"
						src={henryLevins}
					/>
				</div>
				<blockquote className="mt-6 border-none font-medium">
					Finally, a way to make sense of all the content in my Google Drive.
				</blockquote>
				<cite className="not-italic">
					Henry Levens
					<br />
					CEO, Acuserv
				</cite>
			</div>
		</div>
	)
}
