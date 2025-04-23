import { createStore } from 'vuex'
import { auth } from "./authModule"
import { chatRoom } from './chatRoomModule'
import { message } from './messageModule'

const STORE = createStore({
  modules: {
    auth,
    chatRoom,
    message
  }
})

export default STORE
