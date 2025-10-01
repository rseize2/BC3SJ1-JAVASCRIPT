const request = require('supertest')
const express = require('express')
const cookieParser = require('cookie-parser')
const usersRouter = require('./users')

jest.mock('./../services/database', () => ({
    query: jest.fn((sql, params, cb) => cb(null, [{ id: 1, email: 'test@test.com', mot_de_passe: '$2b$10$testhash', role: 'admin' }]))
}))
const db = require('./../services/database')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/api/users', usersRouter)

describe('Users API', () => {
    it('should register a user', async () => {
        db.query.mockImplementationOnce((sql, params, cb) => cb(null, { insertId: 1 }))
        const res = await request(app)
            .post('/api/users/register')
            .send({ name: 'John', prenom: 'Doe', email: 'john@test.com', password: 'password' })
        expect(res.statusCode).toBe(200)
        expect(res.text).toBe('Utilisateur enregistré')
    })

    it('should login a user', async () => {
        const bcrypt = require('bcrypt')
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true)

        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'test@test.com', password: 'password' })
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('token')
    })

    it('should return 401 without token', async () => {
        const res = await request(app).get('/api/users/1')
        expect(res.statusCode).toBe(401)
    })
})
