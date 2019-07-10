import React, { Children } from 'react';
import { Link } from 'react-router-dom';

import logo from '../static/logo.svg';

const Nav = props => (
    <nav className="Nav">
        <Link to="/">
            <span className="Nav-logo">
                <img src={logo} alt="Logo" />
                <span className="Nav-logo-name">Awiki</span>
            </span>
        </Link>
        <div className="Nav-search">
            {props.isSignedIn && <div className="Nav-search-form"><input placeholder="Search Awiki (Mockup)" /></div>}
        </div>
        <div className="Nav-user">{props.children}</div>
        <style jsx>{`
            :global(body) {
                margin: 0;
                font-family: 'Open Sans', -apple-system, BlinkMacSystemFont,
                    Avenir Next, Avenir, Helvetica, sans-serif;
            }
            :global(main) {
                margin-top: 64px;
            }
            .Nav {
                position: fixed;
                top: 0;
                display: flex;
                padding: 8px 16px;
                font: 13px/27px Roboto, RobotoDraft, Arial, sans-serif;
                font-family: 'Google Sans', Roboto, Arial, sans-serif;
                flex-grow: 1;
                flex-shrink: 0;
                flex-basis: auto;
                border-bottom: 1px solid #dadce0;
                width: 100%;
                box-sizing: border-box;
                background-color: white;
                z-index: 1000;
            }
            .Nav-logo {
                height: 48px;
                min-width: 238px;
                flex-grow: 1;
                flex-shrink: 0;
                flex-basis: auto;
                display: flex;
                align-items: center;
            }
            .Nav-logo-name {
                display: inline-block;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                    Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
                    'Helvetica Neue', sans-serif;
                font-size: 22px;
                vertical-align: middle;
                color: #5f6368;
                line-height: 24px;
                padding-left: 4px;
            }
            .Nav-search {
                display: flex;
                height: 48px;
                flex-grow: 1;
                flex-shrink: 1;
                flex-basis: 100%;
            }
            .Nav-search-form {
                background: #f1f3f4;
                border: 1px solid transparent;
                -webkit-border-radius: 8px;
                border-radius: 8px;
                display: flex;
                flex: 1 1 auto;
                margin-right: auto;
                max-width: 720px;
                padding-left: 10px;
                padding-right: 30px;
                position: relative;
                -webkit-transition: background 100ms ease-in,width 100ms ease-out;
                transition: background 100ms ease-in,width 100ms ease-out;
            }
            .Nav-search-form input {
                background-color: #f1f3f4;
                border: none;
                font-size: 1rem;
                margin-left: 46px;
            }
            .Nav-user {
                height: 48px;
                flex-grow: 0;
                flex-shrink: 0;
                flex-basis: auto;
                display: flex;
                justify-content: center;
                flex-direction: column;
            }
            .Nav ul {
                display: flex;
                justify-content: space-between;
            }
            .Nav > ul {
                padding: 4px 16px;
            }
            .Nav li {
                display: flex;
                padding: 6px 8px;
            }
            .Nav a {
                color: #067df7;
                text-decoration: none;
                font-size: 13px;
            }
        `}</style>
    </nav>
);

export default Nav;
