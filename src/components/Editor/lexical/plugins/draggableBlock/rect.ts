import { Point } from './point'

type ContainsPointReturn = {
	result: boolean
	reason: {
		isOnTopSide: boolean
		isOnBottomSide: boolean
		isOnLeftSide: boolean
		isOnRightSide: boolean
	}
}

export class Rectangle {
	private readonly _left: number
	private readonly _top: number
	private readonly _right: number
	private readonly _bottom: number

	constructor(left: number, top: number, right: number, bottom: number) {
		const [physicTop, physicBottom] =
			top <= bottom ? [top, bottom] : [bottom, top]
		const [physicLeft, physicRight] =
			left <= right ? [left, right] : [right, left]

		this._top = physicTop
		this._right = physicRight
		this._left = physicLeft
		this._bottom = physicBottom
	}

	get top(): number {
		return this._top
	}

	get right(): number {
		return this._right
	}

	get bottom(): number {
		return this._bottom
	}

	get left(): number {
		return this._left
	}

	public contains({ x, y }: Point): ContainsPointReturn {
		const isOnTopSide = y < this._top
		const isOnBottomSide = y > this._bottom
		const isOnLeftSide = x < this._left
		const isOnRightSide = x > this._right

		const result =
			!isOnTopSide && !isOnBottomSide && !isOnLeftSide && !isOnRightSide

		return {
			reason: {
				isOnBottomSide,
				isOnLeftSide,
				isOnRightSide,
				isOnTopSide,
			},
			result,
		}
	}

	public generateNewRect({
		left = this.left,
		top = this.top,
		right = this.right,
		bottom = this.bottom,
	}: {
		bottom?: number
		left?: number
		right?: number
		top?: number
	}): Rectangle {
		return new Rectangle(left, top, right, bottom)
	}

	static fromDOM(dom: HTMLElement): Rectangle {
		const { top, width, left, height } = dom.getBoundingClientRect()
		return new Rectangle(left, top, left + width, top + height)
	}
}
