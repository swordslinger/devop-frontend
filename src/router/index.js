/* eslint-disable */
import { createRouter, createWebHashHistory } from 'vue-router'
import Register from '@/components/Register.vue'
import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
import ChatRoom from '@/components/ChatRoom.vue'


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/chatRoom",
    name: "Chat-room",
    component: ChatRoom
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
