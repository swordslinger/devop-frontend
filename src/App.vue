<template>
    <div id="app">
        <h1>Welcome</h1>
        <div id="nav">
            <template v-if="!isLoggedIn">
            <router-link to="/">Home</router-link> |
            <router-link to="/register">register</router-link> |
            <router-link to="/login">Login</router-link> |
        </template>
        <template v-if="isLoggedIn">
            <router-link to="/chatRoom">Chatrooms</router-link>
            <a href="#" @click.prevent="logout">Logout</a>
        </template>
        </div>
        <router-view />
    </div>
</template>

<script>

export default {
    name:'App',
    data () {
        return {
            isLoggedIn: false,
            username: ' '
        }
    },
    created () {
        this.checkLoginStatus()
    },
    methods: {
        checkLoginStatus () {
            const userStr = localStorage.getItem('user')
            if (userStr) {
                const user = JSON.parse(userStr)
                this.isLoggedIn = true
                this.username =  user.username || ""
            } else {
                this.isLoggedIn = false
                this.username = ""
            }
        },
        logout () {
            this.$store.dispatch('auth/logout')
            this.isLoggedIn = false
            this.$router.push('/')
        }
  
    },
    watch: {
        $route () {
            this.checkLoginStatus()
        }
    }
    
}

</script>


