import { Link, useNavigate } from "@tanstack/react-router"
import clsx from "clsx"
import IconButton from "components/gsuite-components/icon-button"
import MenuIcon from "mdi-react/MenuIcon"
import type { ReactNode } from "react"
import { useDispatch, useEffect, useGlobal } from "reactn"
import Search from "./search"


export type NavbarProps = {
    isSignedIn: boolean
    children?: ReactNode
}

function Navbar({ isSignedIn, children }: NavbarProps) {
    const navigate = useNavigate()
    const [, setIsSearchFieldActive] = useGlobal("isSearchFieldActive")
    const [searchTerm, setSearchTerm] = useGlobal("searchTerm")
    const [searchValue, setSearchValue] = useGlobal("searchValue")
    const [showSidebarOnMobile, setShowSidebarOnMobile] = useGlobal(
        "showSidebarOnMobile",
    )

    const clearSearch = useDispatch("clearSearchComplete")

    useEffect(() => {
        if (searchValue !== searchTerm) setSearchValue(searchTerm)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm])

    const submit = () => {
        setSearchTerm(searchValue)
        setIsSearchFieldActive(false)
        navigate({ to: isSignedIn ? '/home' : '/' })
    }

    return (
        <div className="navbar flex h-header w-full">
            {isSignedIn && (
                <div
                    className={clsx("flex items-center pr-2 lg:hidden")}
                >
                    <IconButton
                        onClick={() => {
                            setShowSidebarOnMobile(!showSidebarOnMobile)
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </div>
            )}
            <div className="flex flex-1 items-center">
                {isSignedIn && <Search clearSearch={clearSearch} submit={submit} />}
            </div>
            <div className={clsx("flex items-center pl-2 md:pr-2")}>
                {children}
            </div>
        </div>
    )
}

export default Navbar
