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
            state.messages = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            console.log("get room messages success")
        },
        getRoomMessagesFailure(state){
            state.messages = null
            console.log("get room messages failure")
        }
    }
}