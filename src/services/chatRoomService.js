import axios from 'axios'
import authHeader from './authHeader'

// production
 const CHATROOM_ENDPOINT = '/chatRoom/'

//const CHATROOM_ENDPOINT = 'http://localhost:3002/chatRoom/'

// Class for all chat room related methods.
// This classes methods is for sending get,post delete http requests to the chat room microservice and its endpoints.
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
