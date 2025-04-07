import { createStore } from 'vuex'
import { auth } from "./authModule"
import { chatRoom } from './chatRoomModule'

const STORE = createStore({
  modules: {
    auth,
    chatRoom
  }
})

export default STORE
