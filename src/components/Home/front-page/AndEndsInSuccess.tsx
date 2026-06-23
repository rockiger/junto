import BookPlusMultipleIcon from "mdi-react/BookPlusMultipleIcon";
import MagnifyIcon from "mdi-react/MagnifyIcon";
import ShareVariantIcon from "mdi-react/ShareVariantIcon";
import type { MdiReactIconComponentType } from "mdi-react";
import type { ReactNode } from "react";

function Reason({
	children,
	headline,
	icon: Icon,
}: {
	children: ReactNode;
	headline: string;
	icon: MdiReactIconComponentType;
}) {
	return (
		<div className="col mx-auto flex max-w-sm flex-col items-center px-6 py-6 lg:px-6">
			<div className="mt-12 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white">
				<Icon aria-hidden className="h-12 w-12 text-white" />
			</div>
			<h3 className="mt-8 text-center text-2xl text-white">{headline}</h3>
			<p className="mt-2 text-center">{children}</p>
		</div>
	);
}

export function AndEndsInSuccess() {
	return (
		<div className="bg-[#4285F4] text-white max-lg:px-4">
			<div className="mx-auto max-w-[1280px] py-12 px-8 sm:py-20 sm:px-[6%] lg:px-0">
				<div className="flex flex-col items-center">
					<h2 className="frontpage-header mx-auto mb-8 mt-0 max-w-[45rem] text-center text-[42px] leading-tight font-medium text-white max-sm:text-3xl">
						Manage your knowledge.
						<br />
						Have your records always ready.
					</h2>
				</div>
				<div className="mx-auto flex max-w-7xl flex-col lg:-mx-6 lg:-mt-6 lg:flex-row">
					<Reason headline="Capture Knowledge" icon={BookPlusMultipleIcon}>
						<strong>Easily create</strong> pages with{" "}
						<strong>your knowledge</strong>. Projects, Meeting notes, marketing
						plans - everything saved <strong>in your Google Drive</strong>.
					</Reason>
					<Reason headline="Find information faster" icon={MagnifyIcon}>
						<strong>Organize your records</strong> like your personal Wikipedia.{" "}
						<strong>Link, group and tag</strong> your content or{" "}
						<strong>use the Google-powered search</strong> to find all your
						records fast.
					</Reason>
					<Reason headline="Share Your Work" icon={ShareVariantIcon}>
						Did you <strong>create</strong> some <strong>awesome piece</strong>{" "}
						of content? <strong>Share it</strong> with others, that{" "}
						<strong>they can enjoy</strong> your hard work.
					</Reason>
				</div>
			</div>
		</div>
	);
}
