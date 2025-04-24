<template>
    <h2>Welcome to Individual chatroom </h2>
    <div v-if="loading">Loading chat room...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
        <div>
            <h3>ChatRoom : {{ chatRoomData.name }} </h3>
            <p> What this ChatRoom is about: {{ chatRoomData.description }}</p>
        </div>

        <div>
            <div v-if="messages.length === 0">No messages yet.</div>
            <div v-else>
                <div v-for="msg in messages" :key="msg.id" class="message" :class="{'own-message': msg.user.username === currentUsername}">
                    <div class="message-header">
                        <strong>{{ msg.user.username }}:</strong> {{ msg.content }}
                        <button v-if="msg.user.username === currentUsername" @click="deleteMessage(msg.id)" class="delete-button">Delete</button>
                        </div>
                </div>
            </div>
        </div>

    
    <div>
    <input type="text" v-model="newMessage" placeholder="Type your message here..." @keyup.enter="sendMessage" :disabled="sendingMessage" />
    <button @click="sendMessage" :disabled="!newMessage.trim() || sendingMessage">
        <span v-show="sendingMessage">sending...</span>
        <span v-show="!sendingMessage">Send</span>
    </button>
    </div>
    </div>
</template>

<script>
import { message } from '@/store/messageModule'
import io from 'socket.io-client'
export default {
    name: 'ChatRoomView',
    data() {
        return {
            chatRoomId: null,
            chatRoomData: {
                name: '',
                description: '',
                createdBy: '',
            },
            newMessage: "",
            WebSocket: null,
            loading: true,
            error: null,
            message: "",
            successful: false,
            sendingMessage: false,
            webSocketConnected: false
        }
    },
    computed: {
        currentUsername() {
            return this.$store.state.auth.user.username
        },
        messages() {
            return this.$store.state.message.messages
        }
    },
    created() {
        this.chatRoomId = this.$route.params.id
        this.fetchChatRoomDetails()
        this.connectWebSocket()
    },
    beforeDestroy() {
        this.disconnectWebSocket()
    },
    methods: {
        connectWebSocket(){
            const token = this.$store.state.auth.token || (this.$store.auth.user && this.$store.auth.user.accessToken)
            console.log('Auth State:', this.$store.state.auth)
            console.log('WebSocket token:', token)

            // development
            this.WebSocket = io(`http://localhost:3002`, {
                auth: { token },
               path: '/ws/socket.io'
            })

           // production
           // this.WebSocket = io(window.location.origin, {
           //     auth: { token },
           //     path: '/ws/socket.io'
           // })


            
            this.WebSocket.on('connect', () => {
                console.log('Connected to WebSocket server')
                this.webSocketConnected = true

                this.WebSocket.emit('join-room', this.chatRoomId, (response) => {
                    if (response.status === 'success') {
                        console.log('Joined room successfully:', response.roomId)
                    } else {
                        console.error('Failed to join room:', response.message)
                    }
                })
            })

            this.WebSocket.on('receive-message', (message) => {

                console.log('New message received:', message)
                if (!this.messages.some(m => m.id === message.id)) {
                    this.$store.commit('message/addMessage', message)
                } else {
                    console.log('Duplicate message received, ignoring:', message.id)
                }
            })

            this.WebSocket.on('error', (error) => {
                console.error('WebSocket error:', error)
            })

            this.WebSocket.on('disconnect', () => {
                console.log('Disconnected from WebSocket server')
            })

            this.WebSocket.on('message-deleted', (messageId) => {
                console.log('Message deleted:', messageId)
                this.$store.commit('message/removeMessage', messageId)
            })


        },
        disconnectWebSocket() {
            if (this.WebSocket) {
                this.WebSocket.disconnect()
                console.log('WebSocket disconnected')
            }
        },
        fetchMessages() {
            this.$store.dispatch("message/getRoomMessages", this.chatRoomId).then((data) => {
                console.log("Fetched messages:", this.messages.length)
            }, (error) => {
                this.error = (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    "Failed to load messages"
                console.error("Error fetching messages:", error)
            })
        },
        sendMessage() {
            if (!this.newMessage.trim() || this.sendingMessage) {
                return
            }

            this.sendingMessage = true
            this.message = ""

            const messageData = {
                roomId: this.chatRoomId,
                content: this.newMessage.trim(),
            }

            this.WebSocket.emit('send-message', messageData, (res) => {
                if (res && res.success) {
                    this.message = "Message sent successfully!"
                    this.successful = true
                    this.newMessage = ""
                } else {
                    this.message = "Failed to send message."
                    this.successful = false
                }
                this.sendingMessage = false
            })

  //          const messageContent = this.newMessage.trim()
    //        this.newMessage = ""


      //      this.$store.dispatch("message/sendMessage", messageData)
        //        .then(() => {
          //          this.message = "message sent successfuly",
            //        this.successful = true

              //  }).catch((error) => {
                //            this.message = (error.response && error.response.data && error.response.data.message) ||
                  //              error.message ||
                    //            "Failed to send message"
                      //      this.successful = false
                        //    console.error("Error sending message: ", error)

                          //  this.newMessage = messageContent
                     //   })
               //     .finally(()=> {
                //        this.sendingMessage = false
                //    })
                },

        fetchChatRoomDetails() {
            this.$store.dispatch("chatRoom/getChatRoomById", this.chatRoomId).then((data) => {
                this.chatRoomData = data
                this.fetchMessages()
                //                            
            }, (error) => {
                this.error = (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    "Failed to load chat room details"
                this.loading = false
                console.error("Error fetching chat room details:", error)
            }
            ).finally(() => {
                this.loading = false
            })
        },
        deleteMessage(messageId){
            this.WebSocket.emit('delete-message',{
                messageId: messageId,
                roomId: this.chatRoomId
            }, (res) => {
                if (res && res.success) {
                    this.message = "Message deleted successfully!"
                    this.successful = true
                    console.log("Message deleted successfully:", res.messageId)
                } else {
                    this.message = "Failed to delete message."
                    this.successful = false
                    console.log("failed to deleted message of id:", res.messageId)

                }
            })
        }

    }

}
</script>