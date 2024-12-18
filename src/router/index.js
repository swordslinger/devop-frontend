/* eslint-disable */
import { createRouter, createWebHashHistory } from 'vue-router'
import Register from '@/components/Register.vue'
import Home from '@/components/Home.vue'


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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
