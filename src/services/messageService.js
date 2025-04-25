// This class was for testing/fall back to send messages restfully before implementing a websockets.
import axios from 'axios'
import authHeader from './authHeader'

 //const API_URL = 'http://localhost:3002/chatRoom/'
 const API_URL = '/message/'


class MessageService {
    sendMessage(message){
        const {chatRoomId} = message
        return axios.post(`${API_URL}/room/${chatRoomId}`, {content: message.content},{ headers: authHeader() })
    }

    getRoomMessages(chatRoomId){
        return axios.get(`${API_URL}/room/${chatRoomId}`, { headers: authHeader() })
    }
}

export default new MessageService()