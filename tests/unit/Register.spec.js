import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Register from '@/components/Register.vue'
import { nextTick } from 'vue'
import { global } from 'core-js'

describe('Register.vue test suite', () =>{
    let dispatchMock

    beforeEach(() => {
        dispatchMock = jest.fn()
    })

    const CREATE_COMPONENT = (options = {}) => {
        return mount(Register, {
            global: {
                mocks: {
                    $store: {
                        dispatch: dispatchMock,
                    },
                },
              },
            ...options,
        })
    }

    test('Submits the from and dispatches register action', async ()=>{
         const wrapper = CREATE_COMPONENT()

         await wrapper.find('input[name="username"]').setValue('testuser')
         await wrapper.find('input[name="email"]').setValue('testuser@example.com')
         await wrapper.find('input[name="password"]').setValue('password123')

         dispatchMock.mockResolvedValue({ message: 'Registration successful'})

         await wrapper.find('form').trigger('submit.prevent')
         await flushPromises()

         expect(dispatchMock).toHaveBeenCalledWith('auth/register', {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
         })

    })
})