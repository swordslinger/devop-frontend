// Imports.
import axios from 'axios'

// BASE URL for login,logout and register.
const AUTH_ENDPOINT = 'http://localhost:3000/auth'

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