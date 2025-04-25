import flushPromises from "flush-promises"
import { createStore } from "vuex"
import { mount } from "@vue/test-utils"
import { describe, test, expect, vi } from "vitest"
import  chatRooms  from "../../src/components/ChatRooms.vue"

describe('Chatroom.vue', () => {
    test('should create  chatroom sucessfully', async () => {
        const mockCreateChatRoom = vi.fn().mockResolvedValue({
            id: 'room-123',
            name: 'Test Room',
            description: 'This is a test room',
        })

        const mockGetAllChatRooms = vi.fn().mockResolvedValue([])

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

        const mockPush = vi.fn()

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

        expect(mockGetAllChatRooms).toHaveBeenCalled()

        wrapper.findComponent({ name: 'Form' }).vm.submit();

        await flushPromises()

        expect(mockCreateChatRoom.mock.calls[0][1]).toEqual({
            name: 'Test Room',
            description: 'Test Description',
            createdBy: 'testuser',
        })

        expect(wrapper.vm.message).toBe('Chat room created successfully!')
        expect(wrapper.vm.successful).toBe(true)
        expect(wrapper.vm.loading).toBe(false);

    })
})