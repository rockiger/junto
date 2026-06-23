import RayStartArrowIcon from "mdi-react/RayStartArrowIcon";
import type { ReactNode } from "react";

function Step({
	children,
	headline,
	position,
}: {
	children: ReactNode;
	headline: string;
	position: string;
}) {
	return (
		<div className="col flex flex-1 flex-col items-center justify-start px-6 py-6 lg:px-6">
			<div className="mt-12 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#4285F4] text-white shadow-sm">
				<span className="text-5xl font-normal">{position}</span>
			</div>
			<h4 className="mt-4 text-center text-xl">{headline}</h4>
			<p className="mt-2 text-center">{children}</p>
			<RayStartArrowIcon
				aria-hidden
				className="mt-4 h-8 w-8 shrink-0 text-[#4285F4] lg:-rotate-90"
			/>
		</div>
	);
}

export function HasAPlan() {
	return (
		<div className="py-20">
			<div className="text-center">
				<h2 className="frontpage-header mx-auto my-8 text-center text-[42px] leading-tight font-medium max-sm:text-3xl">
					3 Steps to being effortlessly organized in your Google Drive.
				</h2>
				<div
					style={{ marginLeft: "auto", marginRight: "auto" }}
					className="mx-auto flex max-w-7xl flex-col lg:-mx-6 lg:-mt-6 lg:flex-row"
				>
					<Step headline="Sign in with your Google Account" position="1">
						Simply sign up with your Google Account. Click &quot;Sign in with
						Google&quot;, accept the permissions and we will create your
						personal wiki. No further registration steps are necessary.
					</Step>
					<Step headline="Capture your knowledge" position="2">
						Create notes, link to files in your Google Drive, author memos. Do
						what you want. It is your personal wiki.
					</Step>
					<Step headline="Add more wikis in your Google Drive" position="3">
						Do your notes outgrow your personal wiki? Do you need to collaborate
						with others? Create more wikis where you need them from Google Drive
						- Shared Drives included.
					</Step>
				</div>
			</div>
		</div>
	);
}
