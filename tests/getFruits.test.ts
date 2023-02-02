import supertest from "supertest";
import app from "index";

const api = supertest(app)

describe("Testing api", () => {

    it("Testing GET: /fruits without fruits in memory > must return status 200", async () => {

        const result = await api.get('/fruits')

        expect(result.body).toHaveLength(0)
    })

    it("Testing POST: /fruits only one fruit > must return status 201", async () => {

        const result = await api.post('/fruits').send({ name: 'laranja', price: 300 })

        expect(result.status).toBe(201)
    })

    it("Testing POST: /fruits with wrong data > must return status 422", async () => {

        const result = await api.post('/fruits').send({ name: 'laranja' })

        expect(result.status).toBe(422)

    })

    it("Testing GET: /fruits/:id after add one fruit > must return fruit data", async () => {

        const result = await api.get('/fruits/1')

        expect(result.body).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
            price: expect.any(Number)
        })

        expect(result.status).toBe(200)
    })

    it("Testing POST: /fruits an existent fruit > must return status 409", async () => {

        const result = await api.post('/fruits').send({ name: 'laranja', price: 300 })

        expect(result.status).toBe(409)
    })

    it("Testing GET: /fruits after adding 3 fruits > must return an array of fruits", async () => {

        await api.post('/fruits').send({ name: 'orange', price: 200 })
        await api.post('/fruits').send({ name: 'apple', price: 400 })
        await api.post('/fruits').send({ name: 'banana', price: 500 })
        
        const result = await api.get('/fruits')

        expect(result.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number)
                })
            ])
        )
    })
})
