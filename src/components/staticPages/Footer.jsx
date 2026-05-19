import clsx from "clsx";

import "./footer-link.scss";

export const Footer = () => {
	return (
		<section className="footer">
			<div className="footer__logo">
				<strong>
					<FooterLink to="/">© Fulcrum</FooterLink>
				</strong>
			</div>
			<div>
				<FooterLink to="/privacy-policy">Privacy</FooterLink>
				<FooterLink to="/terms-of-service">Terms Of Service</FooterLink>
			</div>
		</section>
	);
};

export const FooterLink = ({ children, title, to, className }) => {
	return (
		<a className={clsx("footer__link col", className)} href={to} title={title}>
			{children}
		</a>
	);
};
