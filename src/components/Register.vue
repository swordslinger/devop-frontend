<template>
  <Form @submit="Register" :validation-schema="schema">
    <div>
      <label for = "username">Username</label>
      <Field name = "username" type="text" />
      <ErrorMessage name="username" />

      <label for = "email">Email</label>
      <Field name = "email" type="email" />
      <ErrorMessage name="email" />

      <label for = "password">Password</label>
      <Field name = "password" type="password" />
      <ErrorMessage name="password" />

      <button :disabled="loading">
        <span v-show="loading"></span>
        Register
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
  components: {
    Form,
    Field,
    ErrorMessage
  },
  data(){
    return {
      schema: yup.object().shape({
        username: yup.string().required('Username is required'),
        password: yup.string().required('password is required'),
        email: yup.string().required('email is required')
      }),
      message:"",
      successful:false,
      loading: false,
    }
  },
  methods:{
    async Register(user){
      console.log('Register method triggered with:', user)
      this.message = ""
      this.successful = false
      this.loading = true

      try{
      this.$store.dispatch("auth/register", user).then(
        (data) => {
          console.log("Dispatching register action with:", user)
          this.message = data.message
          this.successful = true
        },
        (error) => {
          console.log("Dispatching error", user)
          this.message = (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()
        this.successful = false
        this.loading = false
        }
      )
    }
  }
}
</script>
