/* eslint-disable */
import { createRouter, createWebHashHistory } from 'vue-router'
import Register from '@/components/Register.vue'


const routes = [
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
