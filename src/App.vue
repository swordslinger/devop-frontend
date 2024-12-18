<template>
    <div id="app">
        <h1>Welcome</h1>
        <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/register">About</router-link>
        </div>
        <router-view />
    </div>
</template>

<script>
export default {
    name:'App'
}
</script>


