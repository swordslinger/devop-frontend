import chatRoomService from '@/services/chatRoomService.js'
import { join } from 'core-js/core/array'

const intialState = {
    chatRooms: [],
    currentRoom : null,
    loading: false,
}

export const chatRoom = {
    namespaced: true,
    state: intialState,
    actions : {
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
            ).finally (() => {
                commit('setLoading', false)
            })
        }
    },
    createChatRoom({ commit}, chatRoom){
        commit('setLoading', true)
        return chatRoomService.createChatRoom(chatRoom).then(
            response => {
                commit('createChatRoomSuccess', response.data)
                return Promise.resolve(response.data)
            },
            error => {
                commit('createChatRoomFailure')
                return Promise.reject(error)
            }
        ).finally (() => {
            commit('setLoading', false)
        })
    },
    deleteChatRoom({ commit}, chatRoomId){
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
        ).finally (() => {
            commit('setLoading', false)
        })
    },
    getChatRoomById({ commit}, chatRoomId){
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
        ).finally (() => {
            commit('setLoading', false)
        })
    },
    joinChatRoom({ commit}, chatRoomId){
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
        ).finally (() => {
            commit('setLoading', false)
        })
    },
    deleteChatRoom({ commit}, chatRoomId){
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
        ).finally (() => {
            commit('setLoading', false)
        })
    }
}