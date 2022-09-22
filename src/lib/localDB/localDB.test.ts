import { IPage } from './localDB'
import { addPage, getPageById } from './localDB'

const id1 = 'TESTID1'
const date1 = new Date().toISOString()
const query1: IPage = {
    id: id1,
    content: '',
    editedTime: date1,
    modifiedTime: date1,
}

describe('localDB', () => {
    test('addPage', async () => {
        const data = await addPage(query1)
    })
    test('getPageById', async () => {
        const emptyResult = await getPageById('EMPTYFILE')
        expect(emptyResult).toBe(undefined)

        const result1 = await getPageById(id1)
        expect(result1).toEqual(query1)
    })
})
