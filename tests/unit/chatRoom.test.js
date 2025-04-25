// Imports
import flushPromises from "flush-promises"
import { createStore } from "vuex"
import { mount } from "@vue/test-utils"
import { describe, test, expect, vi } from "vitest"
import ChatRoomView from "../../src/components/ChatRoomView.vue"

// Mock send-message event
const mockSocketEmit = vi.fn((event, data, callback) => {
    if(event === 'send-message' && callback) {
        callback({ success: true })
    }
})

// Mock socket connection
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

// Mock instance of socket
vi.mock('socket.io-client', () => {
    return {
        default: vi.fn(() => mockSocket),
    }
})

describe('ChatroomView.vue', () => {
    test('should send message sucessfully', async () => {
        // Mocks  getChatRoomById action
        const mockGetChatRoomById = vi.fn().mockResolvedValue({
            id: 'room-123',
            name: 'Test Room',
            description: 'This is a test room',
            createdBy: 'testuser',
        })

        // Mocks getRoomMessages action
        const mockGetRoomMessages = vi.fn().mockResolvedValue([])


        // Create a Vuex store with the mocked actions and a mocked addMessage mutation 
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
                // Mock the logged-in user
                auth: {
                    namespaced: true,
                    state: { user: {username: 'testuser'}, token: 'test-token' },
                },
            },
        })

        // Mock the route params to simulate navigating to a specific chat room
        const mockRoute = {
            params: {
                id: 'room-123'
            }
        }

        // Wrap the component with the fake Vuex store and mock route
        const wrapper = mount(ChatRoomView, {
            global: {
                plugins: [store],
                mocks: {
                        $route: mockRoute,
                }            
            }
        })

        // Wait for the component to finish loading and the socket connection to be established
        await flushPromises()

        // Create a message and trigger the sendMessage method
        await wrapper.setData({ newMessage: 'Hello, world!' })
        await wrapper.vm.sendMessage()

        // Wait for the message to be sent and the component to update
        await flushPromises()


        // Check if the socket emit function was called with the correct parameters
        expect(mockSocketEmit).toHaveBeenCalledWith(
            'send-message',
            {
                roomId: 'room-123',
                content: 'Hello, world!'
            },
            expect.any(Function)
        )

        // Check if the message was sent successfully and the component state was updated
        expect(wrapper.vm.newMessage).toBe('');
        expect(wrapper.vm.message).toBe('Message sent successfully!');
        expect(wrapper.vm.successful).toBe(true);
        expect(wrapper.vm.sendingMessage).toBe(false);


    })
})