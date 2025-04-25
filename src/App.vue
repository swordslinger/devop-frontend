<template>
    <div id="app">
        <h1>Welcome</h1>
        <div id="nav">
            <!-- If the user is not logged in these are the routes they can access -->
            <template v-if="!isLoggedIn">
            <router-link to="/">Home</router-link> |
            <router-link to="/register">register</router-link> |
            <router-link to="/login">Login</router-link> |
        </template>
        <!-- If the user is  logged in these are the routes they can access -->
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
    // Check the if user is logged in when the app is created
    created () {
        this.checkLoginStatus()
    },
    methods: {
        // Check the local storage for user data and set the login status accordingly
        checkLoginStatus () {
            const userStr = localStorage.getItem('user')
            // if user data exists in local storage, parse it and set the login status
            if (userStr) {
                const user = JSON.parse(userStr)
                this.isLoggedIn = true
                this.username =  user.username || ""
            // if user data does not exist, set the login status to false
            } else {
                this.isLoggedIn = false
                this.username = ""
            }
        },
        // Logout the user by dispatching the logout action to the store and redirecting to home page
        logout () {
            this.$store.dispatch('auth/logout')
            this.isLoggedIn = false
            this.$router.push('/')
        }
  
    },
    // Watch for changes in the route to check the login status
    watch: {
        $route () {
            this.checkLoginStatus()
        }
    }
    
}

</script>


