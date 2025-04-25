/* eslint-disable */
import { createRouter, createWebHashHistory } from 'vue-router'
import Register from '@/components/Register.vue'
import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
import ChatRoom from '@/components/ChatRooms.vue'
import ChatRoomView from '@/components/ChatRoomView.vue'


// How the user naviagetes differnt parts of the application.
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
    component: ChatRoom,
    meta : {
      requiresAuth: true
    }
  },
  {
    path: '/chatroom/:id',
    name: 'ChatRoomView',
    component: ChatRoomView,
    meta : {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
