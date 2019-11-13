import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import AddIcon from "mdi-react/AddIcon";

import { SidebarTree } from "./SidebarTree";
import { isMobileDevice } from "../../lib/helper";
import { SidebarItem } from "./SidebarItem";
window.isMobileDevice = isMobileDevice;

const SidebarRenderer = props => {
  const classes = useStyles();
  return (
    <>
      {isMobileDevice() && (
        <Fab
          arial-label="Add"
          className={classes.fab}
          color="secondary"
          onClick={props.onClickNewButton}
        >
          <AddIcon className={classes.addIcon} />
        </Fab>
      )}
      <div className={classes.sidebar}>
        {!isMobileDevice() && (
          <div className="Sidebar-newButton" onClick={props.onClickNewButton}>
            <svg
              className={classes.svg}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
            </svg>
            New Page
          </div>
        )}
        {!isMobileDevice() && (
          <div class="Sidebar-Navigation" id="Sidebar-Navigation">
            <SidebarTree />
            <SidebarItem />
          </div>
        )}
        <style>{`
                    .Sidebar-newButton {
                        box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
                            0 1px 3px 1px rgba(60, 64, 67, 0.149);
                        align-items: center;
                        background-color: #fff;
                        background-image: none;
                        border: 1px solid transparent;
                        border-radius: 24px;
                        color: #3c4043;
                        display: inline-flex;
                        font-size: 14px;
                        font-weight: 600;
                        height: 48px;
                        letter-spacing: 0.15px;
                        line-height: 22px;
                        margin: 0 0 0 calc(1rem - 5px);
                        min-width: 120px;
                        padding: 0 1rem;
                        text-transform: none;
                        width: inherit;
                        cursor: pointer;
                    }
                    .Sidebar-newButton:hover {
                        box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.302),
                            0 4px 8px 3px rgba(60, 64, 67, 0.149);
                        background-color: #f8f9fa;
                        outline: none;
                    }
                    .Sidebar-Navigation {
                        height: calc(100vh - 138px);
                    }
                    .Sidebar-Navigation:hover {
                        overflow-y: auto;
                    }
                `}</style>
      </div>
    </>
  );
};
export default SidebarRenderer;

function useStyles() {
  const useStyles = makeStyles(theme => {
    return {
      fab: {
        color: "#fff",
        position: "fixed",
        right: theme.spacing(3),
        bottom: theme.spacing(3),
        visibility: "visible",
        zIndex: 1,
        [theme.breakpoints.up("md")]: {
          display: "none"
        }
      },
      link: {
        display: "flex",
        flexGrow: 1,
        textDecoration: "none",
        alignItems: "center"
      },
      listitem: {
        padding: 0,
        paddingRight: theme.spacing(2)
      },
      svg: {
        fill: theme.palette.secondary.main,
        paddingRight: theme.spacing(1),
        width: theme.spacing(5)
      }
    };
  });
  return useStyles();
}
