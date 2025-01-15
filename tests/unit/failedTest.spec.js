import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { auth } from '@/store/authModule'
import Register from '@/components/Register.vue'
import { createStore } from 'vuex'
import authService from '@/services/authService'

jest.mock('@/services/authService')

describe('Register.vue test suite', () =>{
    let store
    const user = { username: 'testUser', email: 'testuser@example.com',
password: 'password123'}

    beforeEach(() => {
         store = createStore({
            modules:{
                auth
            }
        })
    })

     const CREATE_COMPONENT = (options = {}) => {
         return mount(Register, {
             global: {
                        plugins:[store]
                     },
             ...options,
         })
    }

     test('Submits the from and dispatches register action', async ()=>{
        const mockResponse = { data: { username: 'testUser', id: 1, token: 'token123' } }
        authService.register.mockResolvedValue(mockResponse)

        await store.dispatch('auth/register', user)
        expect(store.state.auth.user).toEqual(mockResponse.data)
        expect(authService.register).toHaveBeenCalledWith(user)


})
    test("submits form", async()=>{
        const wrapper = CREATE_COMPONENT()
        
        await wrapper.find('input[name="username"]').setValue(user.username)
        await wrapper.find('input[name="email"]').setValue(user.email)
        await wrapper.find('input[name="password"]').setValue(user.password)

        const mockResponse = { data: { username: 'testUser', id: 1, token: 'token123' } }
        authService.register.mockResolvedValue(mockResponse)

        await wrapper.find('button').trigger('click')
        await flushPromises()

        expect(store.state.auth.user).toEqual(mockResponse.data)
        expect(authService.register).toHaveBeenCalledWith(user)
    })
})
