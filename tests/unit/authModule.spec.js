import { auth } from "@/store/authModule";
import authService from "@/services/authService";

jest.mock("@/services/authService")

// Test suite for authModule.js.
describe('Vuex store authModule', () => {
    
    // mocks commit function in vuex actions/
    let commit
    beforeEach(() => {
        commit = jest.fn()
    })

    it('Sucessful user registration triggers registerSuccess mutation', async () => {

        const USER = {
            username: 'test',
            email: 'test@gmail.com',
            password: 'test123'
        }

        // Simulates register() returning a user Object.
        authService.register.mockResolvedValue({ data: USER })

       
        await auth.actions.register({ commit }, USER)

        // Ensures commit was called with registrationSuccess and user attributes.
        expect(commit).toHaveBeenCalledWith('registerSuccess', USER)
    })

    it('Unsucessful user registration and triggers registerFailure mutation', async () => {

        const USER = {
            username: 'test',
            email: 'test@gmail.com',
            password: 'test123'
        }

        // Simulates register() returning a Error.
        const ERROR = new Error('Registration failed')
        authService.register.mockResolvedValue(ERROR)


        // Expects registerFailure action to be called and correct error passed.
        try {
            await auth.actions.register({ commit }, USER)
        } catch (e) {
            expect(commit).toHaveBeenCalled('registerFailure')
            expect(e).toBe(ERROR)
        }

    })

    // vertify state is updated with user data.
    it('registerSucess mutation triggerd', async () => {
        
        const STATE = { user: null }

        const USER = {
            username: 'test',
            email: 'test@gmail.com',
            password: 'test123'
        }

        auth.mutations.registerSuccess(STATE, USER)

        expect(STATE.user).toEqual(USER)

    })

    // vertify state is is null upon failed registration.
    it('registerFailure mutation triggerd', async () => {

        const USER = {
            username: 'test',
            email: 'test@gmail.com',
            password: 'test123'
        }

        const STATE = { user: { USER } }

        auth.mutations.registerFailure(STATE)

        expect(STATE.user).toBeNull

    })


})

