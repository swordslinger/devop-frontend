import messageService from "@/services/messageService";
const initialState = {
    messages: [],
    loading: false
}

export const message = {
    namespaced: true,
    state: initialState,
    actions: {
        getRoomMessages({ commit }, roomId){
            commit('setLoading', true)
            return messageService.getRoomMessages(roomId).then(
                response => {
                    commit('getRoomMessagesSuccess', response.data)
                    return Promise.resolve(response.data)
                },
                error => {
                    commit('getRoomMessagesFailure')
                    return Promise.reject(error)
                }
            ).finally(() => {
                commit('setLoading', false)
            })
        },
        sendMessage({commit}, message){
            commit('setLoading', true)
            return messageService.sendMessage(message).then(
                response => {
                    commit('sendMessageSuccess', response.data)
                    return Promise.resolve(response.data)
                },
                error => {
                    commit('sendMessageFailure')
                    return Promise.reject(error)
                }
            ).finally(() => {
                commit('setLoading', false)
            })
        }
    },
    mutations: {
        setLoading(state, loading){
            state.loading = loading
        },
        sendMessageSuccess(state, message){
            state.messages.push(message)
            console.log("send message success")
        },
        sendMessageFailure(state){
            console.log("send message failure")
        },
        getRoomMessagesSuccess(state, messages){
            if(Array.isArray(messages)){
                state.messages = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                console.log("get room messages success")
            } else {
                console.log("expected messages array but got:: ", messages)
                    if(messages && typeof messages === 'object'){
                        const messageArray = messages.message || messages.data || []
                    if(Array.isArray(messageArray)){
                        state.messages = messageArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                    }else {
                        state.messages = []
                    }
            } else {
                state.messages = []
            }

        }

    },
        getRoomMessagesFailure(state){
            state.messages = []
            console.log("get room messages failure")
        },
        addMessage(state, message){
            state.messages.push(message)
            console.log("add message success")
        },
        removeMessage(state, messageId){
            if(Array.isArray(state.messages)){
                state.messages = state.messages.filter(message => message.id !== messageId)
                console.log("Message removed")
            }
        }
    }
}