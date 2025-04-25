<template>
    <!-- Form to login the user   -->
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

<!-- Display success or error message after login   -->
<div v-if="message" :class="successful ? 'alert-success' : 'alert-danger'">
    {{ message }}
  </div>
</template>
<script>

// Imports.
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup'; 
export default {
    name: "Login",
    // Register vee-validate components
    components: {
        Form,
        Field,
        ErrorMessage
    },
    // Validation schema for the form.
    data(){
        const schema = yup.object().shape({
            username: yup.string().required('Username is required'),
            password: yup.string().required('password is required'),
        })
        
        return {
        message:"",
        loading: false,
        successful: false,
        schema,
        }
    },
    // Check the state to see if user is logged in
    computed : {
        loggedIn(){
            return this.$store.state.auth.status.loggedIn
        },
    },
    methods:{
        // Dispatch the login action to the store and handle the response.
        Login(user){
        console.log('Login method triggered with:', user)
        this.loading = true
    
        this.$store.dispatch("auth/login", user).then(
            () => {
            // if login is successful, redirect to home page
            console.log("Dispatching login action with:", user)
                this.$router.push("/");
            },
            // if login fails, set the error message to be displayed
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