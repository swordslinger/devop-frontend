// Imports.
import flushPromises from "flush-promises"
import { createStore } from "vuex"
import { mount } from "@vue/test-utils"
import { describe, test, expect, vi } from "vitest"
import  chatRooms  from "../../src/components/ChatRooms.vue"

describe('Chatroom.vue', () => {
    test('should create  chatroom sucessfully', async () => {
        
        // Fake chatRoom action.
        const mockCreateChatRoom = vi.fn().mockResolvedValue({
            id: 'room-123',
            name: 'Test Room',
            description: 'This is a test room',
        })

        // Fake getAllChatRooms action.
        const mockGetAllChatRooms = vi.fn().mockResolvedValue([])

        // Create a Vuex store with the mocked actions and a logged in user.
        const store = createStore({
            modules: {
                chatRoom: {
                    namespaced: true,
                    state: { },
                    actions: {
                        createChatRoom: mockCreateChatRoom,
                        getAllChatRooms: mockGetAllChatRooms,
                    },
                },
                auth: {
                    namespaced: true,
                    state: { user: {username: 'testuser'} },
                },
            },
        })

        // Mock the router push method.
        const mockPush = vi.fn()

        // Mount the component with the fake storem router mocks and fake vee-validate form.
        const wrapper = mount(chatRooms, {
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
                                    roomName: 'Test Room',
                                    roomDescription: 'Test Description',
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

        //Checks if getAllChatRooms action is called when the component is mounted.
        expect(mockGetAllChatRooms).toHaveBeenCalled()

        // Simulate form submission
        wrapper.findComponent({ name: 'Form' }).vm.submit();

        // Wait for all promises to resolve
        await flushPromises()

        // Check if createChatRoom action is called with the correct parameters.
        expect(mockCreateChatRoom.mock.calls[0][1]).toEqual({
            name: 'Test Room',
            description: 'Test Description',
            createdBy: 'testuser',
        })

        // Check if the state of the component is updated correctly.
        expect(wrapper.vm.message).toBe('Chat room created successfully!')
        expect(wrapper.vm.successful).toBe(true)
        expect(wrapper.vm.loading).toBe(false);

    })
})