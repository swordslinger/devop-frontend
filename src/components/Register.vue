/* eslint-disable */
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
  /* eslint-disable */
  <div v-if="message" :class="successful ? 'alert-success' : 'alert-danger'">
    {{ message }}
  </div>

</template>
/* eslint-disable */
<script>
/* eslint-disable */
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup'; // For validation schema
/* eslint-disable */
export default {
  /* eslint-disable */
  components: {
    Form,
    Field,
    ErrorMessage
  },
  data(){
    return {
      schema: yup.object().shape({
        username: yup.string().required('Username is requried'),
        password: yup.string().required('password is requried'),
        email: yup.string().required('email is requried')
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
