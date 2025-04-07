import chatRoomService from '@/services/chatRoomService.js'


const intialState = {
    chatRooms: [],
    currentRoom: null,
    loading: false,
}

export const chatRoom = {
    namespaced: true,
    state: intialState,
    actions: {
        getAllChatRooms({ commit }) {
            commit('setLoading', true)
            return chatRoomService.getAllChatRooms().then(
                response => {
                    commit('getAllChatRoomsSuccess', response.data)
                    return Promise.resolve(response.data)
                },
                error => {
                    commit('getAllChatRoomsFailure')
                    return Promise.reject(error)
                }
            ).finally(() => {
                commit('setLoading', false)
            })
        },
        createChatRoom({ commit }, chatRoom) {
            commit('setLoading', true)
            return chatRoomService.createChatRoom(chatRoom).then(response => {
                commit('createChatRoomSuccess', response.data)
                return Promise.resolve(response.data)
            },
                error => {
                    commit('createChatRoomFailure')
                    return Promise.reject(error)
                }
            ).finally(() => {
                commit('setLoading', false)
            })
        },
        deleteChatRoom({ commit }, chatRoomId) {
            commit('setLoading', true)
            return chatRoomService.deleteChatRoom(chatRoomId).then(
                response => {
                    commit('deleteChatRoomSuccess', chatRoomId)
                    return Promise.resolve(response.data)
                },
                error => {
                    commit('deleteChatRoomFailure')
                    return Promise.reject(error)
                }
            ).finally(() => {
                commit('setLoading', false)
            })
        },
        getChatRoomById({ commit }, chatRoomId) {
            commit('setLoading', true)
            return chatRoomService.getChatRoomById(chatRoomId).then(
                response => {
                    commit('getChatRoomByIdSuccess', response.data)
                    return Promise.resolve(response.data)
                },
                error => {
                    commit('getChatRoomByIdFailure')
                    return Promise.reject(error)
                }
            ).finally(() => {
                commit('setLoading', false)
            })
        },
        joinChatRoom({ commit }, chatRoomId) {
            commit('setLoading', true)
            return chatRoomService.joinChatRoom(chatRoomId).then(
                response => {
                    commit('joinChatRoomSuccess', response.data)
                    return Promise.resolve(response.data)
                },
                error => {
                    commit('joinChatRoomFailure')
                    return Promise.reject(error)
                }
            ).finally(() => {
                commit('setLoading', false)
            })
        },
        leaveChatRoom({ commit }, chatRoomId) {
            commit('setLoading', true)
            return chatRoomService.leaveChatRoom(chatRoomId).then(
                response => {
                    commit('leaveChatRoomSuccess', chatRoomId)
                    return Promise.resolve(response.data)
                },
                error => {
                    commit('leaveChatRoomFailure')
                    return Promise.reject(error)
                }
            ).finally(() => {
                commit('setLoading', false)
            })
        }

    },


    mutations: {
        setLoading(state, loading) {
            state.loading = loading
        },
        setCurrentRoom(state, chatRoom) {
            state.currentRoom = chatRoom
        },
        getAllChatRoomsSuccess(state, chatRooms) {
            state.chatRooms = chatRooms
            console.log("Get all chat rooms success")
        },
        getAllChatRoomsFailure(state) {
            state.chatRooms = null
            console.log("Get all chat rooms failure")
        },
        createChatRoomSuccess(state, chatRoom) {
            state.chatRooms.push(chatRoom)
            console.log("Create chat room success")
        },
        createChatRoomFailure(state) {
            state.chatRooms = null
            console.log("Create chat room failure")
        },
        joinChatRoomSuccess(state, chatRoom) {
            state.chatRooms.push(chatRoom)
            console.log("Join chat room success")
        },
        joinChatRoomFailure(state) {
            console.log("Join chat room failure")
        },
        leaveChatRoomSuccess(state, chatRoomId) {
            console.log("Leave chat room success")
        },
        leaveChatRoomFailure(state) {
            console.log("Leave chat room failure")
        },
        deleteChatRoomSuccess(state, chatRoomId) {
            state.chatRooms = state.chatRooms.filter(chatRoom => chatRoom.id !== chatRoomId)
            console.log("Delete chat room success")
        },
        deleteChatRoomFailure(state) {
            console.log("Delete chat room failure")
        },
        getChatRoomByIdSuccess(state, chatRoom) {
            state.currentRoom = chatRoom
            console.log("Get chat room by id success")
        },
        getChatRoomByIdFailure(state) {
            state.currentRoom = null
            console.log("Get chat room by id failure")
        }




    }
}