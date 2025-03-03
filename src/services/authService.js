// Imports.
import axios from 'axios'

// BASE URL for login,logout and register. (TEST)
// const AUTH_ENDPOINT = 'http://localhost:3000/auth'

// BASE URL for login,logout and register. (Production)
const AUTH_ENDPOINT = 'http://k8s-default-devopfro-3395a783d4-103de2cc0dd57654.elb.eu-north-1.amazonaws.com'



// Class for login, logout and register methods.
class AuthService{
   // Takes a user object as a paramter with the attributes username,email and password.
   register(user){
    // Sends the users attributes to the register endpoint and returns a http response.
    return axios.post(AUTH_ENDPOINT + '/register', {
        username: user.username,
        email: user.email,
        password: user.password
    })
   } 
}

export default new AuthService