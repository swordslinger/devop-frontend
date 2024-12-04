// imports. 
import axios, { Axios } from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import authService from '@/services/authService'

// Grouping tests for AuthService.
describe('AuthService', () => {
    // mock adapater holder.
    let mock

    // Runs before each test.
    beforeEach(() => {
        // Create mock adapter to intercept and mock axios calls.
        mock = new AxiosMockAdapter(axios)
    })

    // Runs after each test.
    afterEach(() => {
        // Rests adapter.
        mock.restore()
    })

    // Test case for sucesfful http response.
    it('Expected Behaviour: http response 200 with message upon sucessful registration', async () => {
        // Dummy user
        const USER = {
            username: 'test',
            email: 'test@gmail.com',
            password: 'test123'
        }

        // Intercept post request at registration endpoint and respond with status code and message.
        mock.onPost('http://localhost:8080/auth/register').reply(200, { message: 'Success' })

        // Pass dummy user into authService.register method to trigger intercept above.
        const RESPONSE = await authService.register(USER)

        // Vertify successful http status.
        expect(RESPONSE.status).toBe(200)

        // vertify sucessful message
        expect(RESPONSE.data.message).toBe('Success')


    })

    // Test case for registration data validation
    it('Expected Behaviour: Correct user data is sent for registration', async () => {
        // Dummy user
        const USER = {
            username: 'test',
            email: 'test@gmail.com',
            password: 'test123'
        }

        // Intercept post request at registration endpoint and respond with status code and message.
        mock.onPost('http://localhost:8080/auth/register').reply(200, { message: 'Successs' })

        // Pass dummy user into authService.register method to trigger intercept above.
        await authService.register(USER)

        // Capture first post requests data.
        const DATA = JSON.parse(mock.history.post[0].data)

        // Verify register function is sending the dummy user data.
        expect(DATA).toEqual({
            username: USER.username,
            email: USER.email,
            password: USER.password
        })
    })

    // Test case for missing username
    it('Expected Behaviour: returns response status 400, with a messahe saying uername is required ', async () => {
        // Dummy user
        const USER = {
            email: 'test@gmail.com',
            password: 'test123'
        }

        // Intercept post request at registration endpoint and respond with status code and message.
        mock.onPost('http://localhost:8080/auth/register').reply(400, { message: 'Username is required' })

        // Pass dummy user with missing username into authService.register method to trigger error
        try {
            await authService.register(USER)
        } catch (error) {
            expect(error.response.status).toBe(400)

            expect(error.response.data.message).toBe('Username is required')
        }

    })
    // Test case for missing email
    it('Expected Behaviour: returns response status 400, with a message saying email is required ', async () => {
        // Dummy user
        const USER = {
            username: 'test',
            password: 'test123'
        }

        // Intercept post request at registration endpoint and respond with status code and message.
        mock.onPost('http://localhost:8080/auth/register').reply(400, { message: 'Email is required' })

        // Pass dummy user with missing email into authService.register method to trigger error
        try {
            await authService.register(USER)
        } catch (error) {
            expect(error.response.status).toBe(400)

            expect(error.response.data.message).toBe('Email is required')
        }

    })
    // Test case for missing password
    it('Expected Behaviour: returns response status 400, with a message saying password is required ', async () => {
        // Dummy user
        const USER = {
            username: 'test',
            email: 'test@gmail.com',
        }

        // Intercept post request at registration endpoint and respond with status code and message.
        mock.onPost('http://localhost:8080/auth/register').reply(400, { message: 'Password is required' })

        // Pass dummy user with missing password into authService.register method to trigger error
        try {
            await authService.register(USER)
        } catch (error) {
            expect(error.response.status).toBe(400)

            expect(error.response.data.message).toBe('Password is required')
        }

    })

    // Test case for failed server connection
    it('Expected Behaviour: returns response status 500, with a message saying server error  ', async () => {
        // Dummy user
        const USER = {
            username: 'test',
            email: 'test@gmail.com',
            password: 'test 123'
        }

        // Intercept post request at registration endpoint and respond with status code and message.
        mock.onPost('http://localhost:8080/auth/register').reply(500, { message: 'Server error' })

        // Pass dummy user  into authService.register method to trigger error
        try {
            await authService.register(USER)
        } catch (error) {
            expect(error.response.status).toBe(500)

            expect(error.response.data.message).toBe('Server error')
        }

    })
})