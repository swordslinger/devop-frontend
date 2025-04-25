import { createStore } from 'vuex'
import { auth } from "./authModule"
import { chatRoom } from './chatRoomModule'
import { message } from './messageModule'

// Create a new Vuex store for the application for the authentication, chat room, and message modules
const STORE = createStore({
  modules: {
    auth,
    chatRoom,
    message
  }
})

export default STORE
