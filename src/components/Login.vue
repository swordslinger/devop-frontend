<template>
    <Form @submit="Login" :validation-schema="schema">
      <div>
        <label for = "username">Username</label>
        <Field name = "username" type="text" />
        <ErrorMessage name="username" />
 
  
        <label for = "password">Password</label>
        <Field name = "password" type="password" />
        <ErrorMessage name="password" />
  
        <button :disabled="loading">
          <span v-show="loading"></span>
          Login
        </button>
  
  
</div>
</Form>
<div v-if="message" :class="successful ? 'alert-success' : 'alert-danger'">
    {{ message }}
  </div>
</template>
<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup'; 
export default {
    name: "Login",
    components: {
        Form,
        Field,
        ErrorMessage
    },
    data(){
        const schema = yup.object().shape({
            username: yup.string().required('Username is required'),
            password: yup.string().required('password is required'),
        })

        return {
        message:"",
        loading: false,
        schema,
        }
    },
    computed : {
        loggedIn(){
            return this.$store.state.auth.status.loggedIn
        },
    },
    created (){
        if (this.loggedIn) {
            this.$router.push("/chat");
        }
    },
    methods:{
        Login(user){
        console.log('Login method triggered with:', user)
        this.loading = true
    
        this.$store.dispatch("auth/login", user).then(
            () => {
            console.log("Dispatching login action with:", user)
                this.$router.push("/chat");
            },
            (error) => {
            console.log("Error in login action:", error)
            this.loading = false
            this.message = 
                (error.response && 
                error.response.data &&
                error.response.data.message) ||
            error.message || 
            error.toString()
        }
        )
        },
    },
}
</script>