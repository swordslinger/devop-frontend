import axios from 'axios'
import authHeader from './authHeader'

const CHATROOM_ENDPOINT = 'http://localhost:3002/auth/'

class ChatRoomService {
    createChatRoom(chatRoom) {
        return axios.post(CHATROOM_ENDPOINT + 'create', chatRoom, { headers: authHeader() })
    }

    getAllChatRooms() {
        return axios.get(CHATROOM_ENDPOINT, { headers: authHeader() })
    }
    
    getChatRoomById(chatRoomId) {
        return axios.get(CHATROOM_ENDPOINT + chatRoomId, { headers: authHeader() })
    }

    joinChatRoom(chatRoomId) {
        return axios.post(CHATROOM_ENDPOINT + chatRoomId + '/join', {}, { headers: authHeader() })
    }

    leaveChatRoom(chatRoomId) {
        return axios.delete(CHATROOM_ENDPOINT + chatRoomId + '/leave', { headers: authHeader() })
    }

    deleteChatRoom(chatRoomId) {
        return axios.delete(CHATROOM_ENDPOINT + chatRoomId, { headers: authHeader() })
    }
}

export default new ChatRoomService()
