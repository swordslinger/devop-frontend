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

    // Test case for registration.
    it('Expected Behaviour', async() => {
        // Dummy user
        const USER = {
            username:'test',
            email:'test@gmail.com',
            password:'test123'
        }

        // Intercept post request at registration endpoint and respond with status code and message.
        mock.onPost('http://localhost:8080/auth/register').reply(200, {message: 'Successs'})

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
})