/* eslint-disable */
import { createRouter, createWebHashHistory } from 'vue-router'
import Register from '@/components/Register.vue'
import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'


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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
