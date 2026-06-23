import { createElement, isValidElement } from "react"
import { describe, expect, it, vi } from "vitest"
import FrontPage from "./front-page"

vi.mock("components/Tracking", () => ({
	PageView: vi.fn(),
	Event: vi.fn(),
}))

describe("FrontPage", () => {
	it("is a valid function component", () => {
		expect(typeof FrontPage).toBe("function")
		expect(isValidElement(createElement(FrontPage))).toBe(true)
	})
})
