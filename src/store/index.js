import { createStore } from 'vuex'
import { auth } from "./authModule"

const STORE = createStore({
  modules: {
    auth,
  }
})

export default STORE
