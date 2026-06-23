import { IconButton, Modal, Spinner } from "components/gsuite-components";
import HelpIcon from "mdi-react/HelpCircleOutlineIcon";
import React, { Suspense, useState } from "react";

const HelpDialog = React.lazy(() => import("./help-dialog"));

export { Help };

export default function Help(_props) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<IconButton
				id="HelpButton"
				className="hidden md:block"
				onClick={toggle}
				selected={isOpen}
				tooltip="Show Help"
			>
				<HelpIcon />
			</IconButton>
			{isOpen && (
				<Modal
					onClose={() => setIsOpen(false)}
					isOpen={isOpen}
					fullHeight
					maxWidth="lg"
					title="Help"
				>
					<Suspense
						fallback={
							<div>
								<Spinner />
							</div>
						}
					>
						<HelpDialog isOpen={isOpen} setIsOpen={setIsOpen} />
					</Suspense>
				</Modal>
			)}
		</>
	);

	function toggle() {
		setIsOpen(!isOpen);
	}
}
