import axios from 'axios'
import authHeader from './authHeader'

const API_URL = 'http://localhost:3002/auth'

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