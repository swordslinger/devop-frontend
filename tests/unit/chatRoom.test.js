import flushPromises from "flush-promises"
import { createStore } from "vuex"
import { mount } from "@vue/test-utils"
import { describe, test, expect, vi } from "vitest"
import ChatRoomView from "../../src/components/ChatRoomView.vue"

const mockSocketEmit = vi.fn((event, data, callback) => {
    if(event === 'send-message' && callback) {
        callback({ success: true })
    }
})

const mockSocket = {
    on: vi.fn((event,handler) => {
        if(event === 'connect') {
            setTimeout(() => handler(), 0)
        }
        return mockSocket
    }),
    emit: mockSocketEmit,
    disconnect: vi.fn()
}
vi.mock('socket.io-client', () => {
    return {
        default: vi.fn(() => mockSocket),
    }
})

describe('ChatroomView.vue', () => {
    test('should send message sucessfully', async () => {
        const mockGetChatRoomById = vi.fn().mockResolvedValue({
            id: 'room-123',
            name: 'Test Room',
            description: 'This is a test room',
            createdBy: 'testuser',
        })

        const mockGetRoomMessages = vi.fn().mockResolvedValue([])

        const store = createStore({
            modules: {
                chatRoom: {
                    namespaced: true,
                    state: { },
                    actions: {
                        getChatRoomById: mockGetChatRoomById,
                    },
                },
                message: {
                    namespaced: true,
                    state: { 
                        messages: [],
                    },
                    mutations: {
                        addMessage: vi.fn()
                    },
                    actions: {
                        getRoomMessages: mockGetRoomMessages,
                    },
                },
                auth: {
                    namespaced: true,
                    state: { user: {username: 'testuser'}, token: 'test-token' },
                },
            },
        })

        const mockRoute = {
            params: {
                id: 'room-123'
            }
        }

        const wrapper = mount(ChatRoomView, {
            global: {
                plugins: [store],
                mocks: {
                        $route: mockRoute,
                }            
            }
        })

        await flushPromises()

        await wrapper.setData({ newMessage: 'Hello, world!' })
        await wrapper.vm.sendMessage()

        await flushPromises()


        expect(mockSocketEmit).toHaveBeenCalledWith(
            'send-message',
            {
                roomId: 'room-123',
                content: 'Hello, world!'
            },
            expect.any(Function)
        )

        expect(wrapper.vm.newMessage).toBe('');
        expect(wrapper.vm.message).toBe('Message sent successfully!');
        expect(wrapper.vm.successful).toBe(true);
        expect(wrapper.vm.sendingMessage).toBe(false);


    })
})