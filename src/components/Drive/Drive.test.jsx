import { createPath } from './Drive-container'

describe('create the right path', () => {
    it('createPath works', () => {
        const testSearch =
            '?state=%7B%22ids%22:%5B%221t97b94Mq6ygzKARcgzPE8TnYIaCPLqe2%22%5D,%22action%22:%22open%22,%22userId%22:%22111463931670948596470%22%7D'

        expect(createPath('')).toBe('/')
        expect(createPath(null)).toBe('/')
        expect(createPath(testSearch)).toBe(
            '/page/1t97b94Mq6ygzKARcgzPE8TnYIaCPLqe2'
        )
    })
})
