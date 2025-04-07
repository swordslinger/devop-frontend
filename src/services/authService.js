// Imports.
import axios from 'axios'

// BASE URL for login,logout and register. (TEST)
const AUTH_ENDPOINT = 'http://localhost:3000/auth'
const AUTH_ENDPOINT2 = 'http://localhost:3001/auth'

// BASE URL for login,logout and register. (Production)
//const AUTH_ENDPOINT = 'http://k8s-default-devopfro-3395a783d4-103de2cc0dd57654.elb.eu-north-1.amazonaws.com'



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

   login(user){
    // Sends the users attributes to the login endpoint and returns a http response.
    console.log("Login user", user)
    return axios.post(AUTH_ENDPOINT2 + '/login', {
        username: user.username,
        password: user.password
    })
    .then(response => {
        console.log("Login  successs response", response.data)
        if(response.data.accessToken){
            localStorage.setItem('user', JSON.stringify(response.data))
        }
    return response
   }).catch(error => {
        console.log("Login error", error)
        return error
    })
}

logout(){
    localStorage.removeItem('user')
}
      
}

export default new AuthService