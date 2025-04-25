import messageService from "@/services/messageService";
// intial state
const initialState = {
    messages: [],
    loading: false
}

export const message = {
    namespaced: true,
    state: initialState,
    actions: {
        // Call getRoomMessages method from messageService and commit the relevant mutation based on the response.
        // If the response is successful, commit getRoomMessagesSuccess mutation and return the messages.
        // If the response is unsuccessful, commit getRoomMessagesFailure mutation and return the error.
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
        // Call sendMessage method from messageService and commit the relevant mutation based on the response.
        // If the response is successful, commit sendMessageSuccess mutation and return the message.
        // If the response is unsuccessful, commit sendMessageFailure mutation and return the error.
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
        // If the message is sent successfully, push the message to the messages array in the state and log the success message.
        sendMessageSuccess(state, message){
            state.messages.push(message)
            console.log("send message success")
        },
        // If the message is sent not sent successfully, log a m essage.
        sendMessageFailure(state){
            console.log("send message failure")
        },
        // If the messages are received successfully, sort the messages by when they were created and set the messages array in the state.
        getRoomMessagesSuccess(state, messages){
            if(Array.isArray(messages)){
                state.messages = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                console.log("get room messages success")
            } else {
                // If the messages are not in an array format, convert them to an array and sort them by when they were created.
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
        // If the messages are not received successfully, set the messages array in the state to an empty array and log a message.
        getRoomMessagesFailure(state){
            state.messages = []
            console.log("get room messages failure")
        },
        // If the message is added successfully, push the message to the messages array in the state and log a success message.
        addMessage(state, message){
            state.messages.push(message)
            console.log("add message success")
        },
        // if the message is deleted successfully, filter the messages array in the state to remove the message with the given id and log a success message.
        removeMessage(state, messageId){
            if(Array.isArray(state.messages)){
                state.messages = state.messages.filter(message => message.id !== messageId)
                console.log("Message removed")
            }
        }
    }
}