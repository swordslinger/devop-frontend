import chatRoomService from '@/services/chatRoomService.js'


// initial state
const intialState = {
    chatRooms: [],
    currentRoom: null,
    loading: false,
}

export const chatRoom = {
    namespaced: true,
    state: intialState,
    actions: {
        // Call getAllChatRooms method from chatRoomService and commit the relevant mutation based on the response.
        // If the response is successful, commit getAllChatRoomsSuccess mutation and return the chatrooms.
        // If the response is unsuccessful, commit getAllChatRoomsFailure mutation and return the error.
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
        // Call createChatRoom method from chatRoomService and commit the relevant mutation based on the response.
        // If the response is successful, commit createChatRoomSuccess mutation and pass the chatroom to it.
        // If the response is unsuccessful, commit createChatRoomFailure mutation and return the error.
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
        // Call deleteChatRoom method from chatRoomService and commit the relevant mutation based on the response.
        // If the response is successful, commit deleteChatRoomSuccess mutation and pass the chatroom id to it.
        // If the response is unsuccessful, commit deleteChatRoomFailure mutation and return the error.
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
        // Call getChatRoomById method from chatRoomService and commit the relevant mutation based on the response.
        // If the response is successful, commit getChatRoomByIdSuccess mutation and pass the chatroom to it.
        // If the response is unsuccessful, commit getChatRoomByIdFailure mutation and return the error.
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
        // Call joinChatRoom method from chatRoomService and commit the relevant mutation based on the response.
        // If the response is successful, commit joinChatRoomSuccess mutation and pass the chatroom to it.
        // If the response is unsuccessful, commit joinChatRoomFailure mutation and return the error.
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
        // Call leaveChatRoom method from chatRoomService and commit the relevant mutation based on the response.
        // If the response is successful, commit leaveChatRoomSuccess mutation and pass the chatroom id to it.
        // If the response is unsuccessful, commit leaveChatRoomFailure mutation and return the error.
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
        // Populate the the state with the chatrooms received from the server.
        getAllChatRoomsSuccess(state, chatRooms) {
            state.chatRooms = chatRooms
            console.log("Get all chat rooms success")
        },
        // If the chatrooms are not received from the server, set the chatrooms to null.
        getAllChatRoomsFailure(state) {
            state.chatRooms = null
            console.log("Get all chat rooms failure")
        },
        // Add the chatroom to the state if it is created successfully.
        createChatRoomSuccess(state, chatRoom) {
            state.chatRooms.push(chatRoom)
            console.log("Create chat room success")
        },
        // If the chatroom is not created successfully, set the chatrooms to null.
        createChatRoomFailure(state) {
            state.chatRooms = null
            console.log("Create chat room failure")
        },
        // If the chatroom is joined successfully, add the chatroom to the state.
        joinChatRoomSuccess(state, chatRoom) {
            state.chatRooms.push(chatRoom)
            console.log("Join chat room success")
        },
        // If the chatroom is not joined successfully, log the error.
        joinChatRoomFailure(state) {
            console.log("Join chat room failure")
        },
        // If the chatroom is left successfully, log a message
        leaveChatRoomSuccess(state, chatRoomId) {
            console.log("Leave chat room success")
        },
        // If the chatroom is not left successfully, log a message.
        leaveChatRoomFailure(state) {
            console.log("Leave chat room failure")
        },
        // If the chatroom is deleted successfully, remove the chatroom from the state based on id.
        deleteChatRoomSuccess(state, chatRoomId) {
            state.chatRooms = state.chatRooms.filter(chatRoom => chatRoom.id !== chatRoomId)
            console.log("Delete chat room success")
        },
        // If the chatroom is not deleted successfully, log a message.
        deleteChatRoomFailure(state) {
            console.log("Delete chat room failure")
        },
        // If the chatroom is received successfully, set the current room to the chatroom.
        getChatRoomByIdSuccess(state, chatRoom) {
            state.currentRoom = chatRoom
            console.log("Get chat room by id success")
        },
        // If the chatroom is not received successfully, set the current room to null.
        getChatRoomByIdFailure(state) {
            state.currentRoom = null
            console.log("Get chat room by id failure")
        }

    }
}