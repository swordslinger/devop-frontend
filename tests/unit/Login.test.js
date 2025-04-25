// Imports
import flushPromises from "flush-promises"
import { createStore } from "vuex"
import { mount } from "@vue/test-utils"
import { describe, test, expect, vi } from "vitest"
import Login from "../../src/components/Login.vue"

describe('Login.vue', () => {
    test('should Login sucessfully when credentials are valid', async () => {
        // Mock login action
        const mockLogin = vi.fn().mockResolvedValue({})


        // Create a fake Vuex store with the mocked actions
        const store = createStore({
            modules: {
                auth: {
                    namespaced: true,
                    state: { status: {} },
                    actions: {
                        login: mockLogin,
                    },
                },
            },
        })

        // Mock the router push method
        const mockPush = vi.fn()

        // Mount the component with the fake store, router mocks, and fake vee-validate form
        const wrapper = mount(Login, {
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

        // Wait for promises to resolve
        await flushPromises()

        // Check if the login action was called
        expect(mockLogin.mock.calls[0][1]).toEqual({
            username: 'testuser',
            password: 'testpassword123'
        })

    })
})