<template>
  <Form @submit= "Register" :validation-schema="schema">
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
      })
    }
  },
  methods:{
    Register(values){
      console.log(values)
    }
  }
}
</script>
