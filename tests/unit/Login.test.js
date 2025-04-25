import flushPromises from "flush-promises"
import { createStore } from "vuex"
import { mount } from "@vue/test-utils"
import { describe, test, expect, vi } from "vitest"
import Login from "../../src/components/Login.vue"

describe('Login.vue', () => {
    test('should Login sucessfully when credentials are valid', async () => {
        const mockLogin = vi.fn().mockResolvedValue({})

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

        const mockPush = vi.fn()

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

        wrapper.findComponent({ name: 'Form' }).vm.submit();

        await flushPromises()

        expect(mockLogin.mock.calls[0][1]).toEqual({
            username: 'testuser',
            password: 'testpassword123'
        })

    })
})