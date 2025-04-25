// Imports
import flushPromises from "flush-promises"
import { createStore } from "vuex"
import { mount } from "@vue/test-utils"
import { describe, test, expect, vi } from "vitest"
import Register from "../../src/components/Register.vue"


describe('Register.vue', () => {
    test('should Register sucessfully when credentials are valid', async () => {
        
        // Mock registration action
        const successMessage = 'Registration successful!'
        const mockRegister = vi.fn().mockResolvedValue({
            message: successMessage
        })

        // Create a fake Vuex store with the mocked actions
        const store = createStore({
            modules: {
                auth: {
                    namespaced: true,
                    state: { status: {} },
                    actions: {
                        register: mockRegister,
                    },
                },
            },
        })

        // Mock the router push method
        const mockPush = vi.fn()

        // Mount the component with the fake store, router mocks, and fake vee-validate form
        const wrapper = mount(Register, {
            global: {
                plugins: [store],
                mocks: {
                    $router: {
                        push: mockPush
                    }
                },
                components: {
                    Form: {
                        template: '<form><slot /></form>',
                        methods: {
                            submit(){
                                const data = {
                                    username: 'testuser',
                                    email: 'test@example.com',
                                    password: 'testpassword123'
                                }
                                this.$emit('submit', data)
                            }
                        }
                    },
                    Field :{
                        props: ['name', 'type'],
                        template : '<input :name="name" :type="type" />',
                    },
                    ErrorMessage: {
                        props: ['name'],
                        template: '<span></span>'
                    }
                }
            }
        })

        // Simulate form submission
        wrapper.findComponent({ name: 'Form' }).vm.submit();

        
        await flushPromises()

        // Check if the register action was called with the correct payload
        expect(mockRegister.mock.calls[0][1]).toEqual({
            username: 'testuser',
            email: 'test@example.com',
            password: 'testpassword123'
        })

        // Check if the components state was updated correctly
        expect(wrapper.vm.message).toBe(successMessage)
        expect(wrapper.vm.successful).toBe(true)
        expect(wrapper.vm.loading).toBe(false);

    })
})