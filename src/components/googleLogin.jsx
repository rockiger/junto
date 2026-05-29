// look into https://github.com/anthonyjgrove/react-google-login for more information
// and posibilitys with google authentication

import Button from "components/gsuite-components/button";
import { mergeHintData } from "components/gsuite-components/hint";
import IconButton from "components/gsuite-components/icon-button";
import { createFile, createNewWiki } from "db";
import LogoutIcon from "mdi-react/LogoutIcon";
import PropTypes from "prop-types";
import React from "reactn";
import { OVERVIEW_NAME, OVERVIEW_VALUE } from "../lib/constants";
import {
	downloadFile,
	ensureGapi,
	getFolderId,
	getGapi,
	listAppDataFiles,
	listFilesChunked as listFiles,
	refreshSession,
	updateFile,
} from "../lib/gdrive";
import { Event } from "./Tracking";

export default class GoogleLogin extends React.Component {
	componentDidMount() {
		this.handleClientLoad();
	}

	componentDidUpdate() {
		const { isFileListLoading, isSignedIn, oldSearchTerm, searchTerm } =
			this.global;
		console.log(
			"componentDidUpdate:",
			isFileListLoading,
			oldSearchTerm,
			searchTerm,
		);
		if (!isFileListLoading && oldSearchTerm !== searchTerm && isSignedIn) {
			if (searchTerm) {
				this.updateFiles();
			} else {
				this.setGlobal({ files: this.global.initialFiles });
			}
		}
	}

	/**
	 *  On load, called to load the auth2 library and API client library.
	 */
	handleClientLoad = async () => {
		this.setGlobal({ isSigningIn: true });
		try {
			await ensureGapi();
			getGapi().load("client:auth2", this.initClient);
		} catch (error) {
			this.onFailure(error);
		}
	};

	/**
	 *  Initializes the API client library and sets up sign-in state
	 *  listeners.
	 */
	initClient = () => {
		const { clientId, apiKey, discoveryDocs, scope } = this.props;
		getGapi().client
			.init({
				apiKey,
				clientId,
				discoveryDocs,
				scope,
			})
			.then(
				() => {
					this.onSuccess();
				},
				(error) => {
					this.onFailure(error);
				},
			);
	};

	onSuccess = () => {
		// Listen for sign-in state changes.
		getGapi().auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
		// Handle the initial sign-in state.
		this.updateSigninStatus(
			getGapi().auth2.getAuthInstance().isSignedIn.get(),
		);
	};

	/**
	 * Initially load files, get the rootFolderId
	 */
	initFiles = async () => {
		console.log("initFiles");
		this.setGlobal({
			isFileListLoading: true,
			isInitialFileListLoading: true,
		});
		const rootFolderId = await getFolderId();
		if (rootFolderId) {
			try {
				const files = await listFiles();
				this.setState({ isLoading: false });
				this.setGlobal({
					files,
					initialFiles: files,
					isFileListLoading: false,
					rootFolderId,
					isInitialFileListLoading: false,
				});
			} catch (err) {
				console.log({ err });
				const body = err.body ? JSON.parse(err.body) : {};
				const { error } = body;
				if (error && error.message === "Invalid Credentials") {
					try {
						await refreshSession();
						this.initFiles();
					} catch (err) {
						alert(`Couldn't refresh session: ${err.message}`);
						console.log({ err });
					}
				} else {
					alert(`Couldn't load files ${err}`);
					console.log({ error });
				}
			}
		} else {
			const newRootFolderId = await createNewWiki();
			await createFile(OVERVIEW_NAME, newRootFolderId, OVERVIEW_VALUE);
			// this.setState({folderId: newFolderId})
			console.log("newFolderId:", newRootFolderId);
			this.initFiles();
		}
	};

	/**
	 * Initially load hints
	 */
	initHints = async () => {
		console.log("initHints");
		const appDataFolderList = await listAppDataFiles();
		console.log(appDataFolderList);
		const hintsProps = _.find(appDataFolderList, ["name", "hints.json"]);
		const hintsModule = await import("lib/constants/hints");
		const { hints } = hintsModule;
		if (_.isUndefined(hintsProps)) {
			const hintsFileId = await createFile(
				"hints.json",
				"appDataFolder",
				false,
			);
			await updateFile(hintsFileId, {}, false);
			console.log({ hints });
			this.setGlobal({ hints: hints, hintsFileId });
		} else {
			const hintsAppData = JSON.parse(await downloadFile(hintsProps.id));
			this.setGlobal({
				hints: mergeHintData(hints, hintsAppData),
				hintsFileId: hintsProps.id,
			});
		}
	};

	initUser = () => {
		try {
			const userId = getGapi().auth2
				.getAuthInstance()
				.currentUser.get()
				.getId();
			this.setGlobal({
				userId,
			});
			console.log({ userId });
		} catch (e) {
			console.error("Couldn't get userId", e);
		}
	};

	/**
	 * Initially load files, get the rootFolderId
	 */
	updateFiles = async () => {
		console.log("updateFiles");
		this.setGlobal({ isFileListLoading: true });
		const { rootFolderId, searchTerm } = this.global;
		if (rootFolderId) {
			try {
				const files = await listFiles(searchTerm);
				console.log("listFiles:", files);
				this.setState({ isLoading: false });
				this.setGlobal({
					files,
					isFileListLoading: false,
					oldSearchTerm: searchTerm,
				});
			} catch (err) {
				const body = JSON.parse(err.body);
				const { error } = body;
				if (error.message === "Invalid Credentials") {
					try {
						await refreshSession();
						this.updateFiles();
					} catch (err) {
						alert(`Couldn't refresh session: ${err.message}`);
						console.log({ err });
					}
				} else {
					alert(`Couldn't load files ${err}`);
					console.log({ error });
				}
			}
		}
	};

	onFailure = (error) => {
		this.setState({ isSigningIn: false });
		this.updateSigninStatus(false);
		console.log(JSON.stringify(error, null, 2));
	};

	/**
	 *  Called when the signed in status changes, to update the UI
	 *  appropriately. After a sign-in, the API is called.
	 */
	updateSigninStatus = (isSignedIn) => {
		console.log({ isSignedIn });
		this.setGlobal({ isSignedIn, isSigningIn: false });
		if (isSignedIn && !this.global.isFileListLoading) {
			this.initUser();
			this.initFiles();
			this.initHints();
		}
	};

	/**
	 *  Sign in the user upon button click.
	 */
	handleAuthClick = (_event) => {
		this.setGlobal({ isSigningIn: true });
		getGapi().auth2
			.getAuthInstance()
			.signIn()
			.then(
				(user) => {
					console.log(user);
				},
				(_err) => {
					// end signingIn because breakup of process
					this.setGlobal({ isSigningIn: false });
				},
			);
		Event("Header", "Sign In Button");
	};

	render() {
		if (this.global.isSignedIn) {
			return (
				<IconButton
					id="LogoutButton"
					onClick={handleSignoutClick}
					tooltip="Sign out"
				>
					<LogoutIcon />
				</IconButton>
			);
		} else {
			return (
				<span>
					<Button
						color="primary"
						edge="end"
						id="authorize_button"
						className="action"
						primary
						onClick={this.handleAuthClick}
					>
						{this.props.buttonText}
					</Button>
				</span>
			);
		}
	}
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
	getGapi().auth2.getAuthInstance().signOut();
	event.preventDefault();
	Event("Header", "Sign Out Button");
}

GoogleLogin.propTypes = {
	clientId: PropTypes.string.isRequired,
	//apiKey: PropTypes.string.isRequired,
	scope: PropTypes.string,
	discoveryDocs: PropTypes.array,

	buttonText: PropTypes.node,
};

GoogleLogin.defaultProps = {
	isSignedIn: false,
	buttonText: "Login with Google",
};
