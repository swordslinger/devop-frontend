<template>
    <h2>Welcome to Individual chatroom </h2>
    <!-- Display a loading message/error message if the indiviudal chatroom does not render   -->
    <div v-if="loading">Loading chat room...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
        <!-- Display the chat room name information   -->
        <div>
            <h3>ChatRoom : {{ chatRoomData.name }} </h3>
            <p> What this ChatRoom is about: {{ chatRoomData.description }}</p>
        </div>

        <!-- Display the chat room messages and who sent them-->
        <div>
            <!-- Show place holder when no messages exist -->
            <div v-if="messages.length === 0">No messages yet.</div>
            <div v-else>
                <div v-for="msg in messages" :key="msg.id" class="message" :class="{'own-message': msg.user.username === currentUsername}">
                    <div class="message-header">
                        <strong>{{ msg.user.username }}:</strong> {{ msg.content }}
                        <!-- Only allow the user who created the message to delete it -->
                        <button v-if="msg.user.username === currentUsername" @click="deleteMessage(msg.id)" class="delete-button">Delete</button>
                        </div>
                </div>
            </div>
        </div>

    
    <!-- Message inpunt and sending -->
    <div>
        <!-- Dsable iwhen input is empty or a message is being sent -->
    <input type="text" v-model="newMessage" placeholder="Type your message here..." @keyup.enter="sendMessage" :disabled="sendingMessage" />
    <button @click="sendMessage" :disabled="!newMessage.trim() || sendingMessage">
        <!-- Dynamic based on sending state -->
        <span v-show="sendingMessage">sending...</span>
        <span v-show="!sendingMessage">Send</span>
    </button>
    </div>
    </div>
</template>

<script>
// Imports.
import io from 'socket.io-client'
export default {
    name: 'ChatRoomView',
    // Information for local state management.
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
    // Returns the current username and and messages from global state.
    computed: {
        currentUsername() {
            return this.$store.state.auth.user.username
        },
        messages() {
            return this.$store.state.message.messages
        }
    },
    // When the user lands on this page fetch chat room details and connect to WebSocket.
    created() {
        this.chatRoomId = this.$route.params.id
        this.fetchChatRoomDetails()
        this.connectWebSocket()
    },
    // When the user leaves the page disconnect from WebSocket.
    beforeDestroy() {
        this.disconnectWebSocket()
    },
    methods: {       
        connectWebSocket(){
            // Check if the user is logged in and has a token
            const token = this.$store.state.auth.token || (this.$store.auth.user && this.$store.auth.user.accessToken)
            console.log('Auth State:', this.$store.state.auth)
            console.log('WebSocket token:', token)

            // development
           /// this.WebSocket = io(`http://localhost:3002`, {
           //     auth: { token },
           //    path: '/ws/socket.io'
           // })

        //production

        // Get the WebSocket URL.
        this.WebSocket = io(window.location.origin, {
            auth: { token },
            path: '/ws/socket.io'
        })

        // Connect to the WebSocket server.
        this.WebSocket.on('connect', () => {
            console.log('Connected to WebSocket server')
            this.webSocketConnected = true

            // When User tries to a join a chat room emit a join room event to the webSocket server.            
            this.WebSocket.emit('join-room', this.chatRoomId, (response) => {
            if (response.status === 'success') {
                    console.log('Joined room successfully:', response.roomId)
                } else {
                    console.error('Failed to join room:', response.message)
                    }
                })
        })

            // Listen for incoming messages.
            this.WebSocket.on('receive-message', (message) => {

                console.log('New message received:', message)
                // Check if the message already exists in the store before adding it
                if (!this.messages.some(m => m.id === message.id)) {
                    this.$store.commit('message/addMessage', message)
                } else {
                    console.log('Duplicate message received, ignoring:', message.id)
                }
            })

            // Listener for connection errors.
            this.WebSocket.on('error', (error) => {
                console.error('WebSocket error:', error)
            })

            // Listener for when user disconnects from websocket.
            this.WebSocket.on('disconnect', () => {
                console.log('Disconnected from WebSocket server')
            })

            // listens for a when a user deletes a message.
            this.WebSocket.on('message-deleted', (messageId) => {
                console.log('Message deleted:', messageId)
                // Remove the message from the store.
                this.$store.commit('message/removeMessage', messageId)
            })


        },
        // Disconnect from the WebSocket server.
        disconnectWebSocket() {
            if (this.WebSocket) {
                this.WebSocket.disconnect()
                console.log('WebSocket disconnected')
            }
        },
        // Fetch messages from the store.
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
        // Send a message to the chat room via WebSocket.
        sendMessage() {
            // Check if the message is empty or if a message is already being sent.
            if (!this.newMessage.trim() || this.sendingMessage) {
                return
            }
            // Set the sending message state to true and clear the message.
            this.sendingMessage = true
            this.message = ""

            // Create the message data object.
            const messageData = {
                roomId: this.chatRoomId,
                content: this.newMessage.trim(),
            }

            // Emit the send-message event to the WebSocket server.
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

        },

        // Fetch chat room details from the store.
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
        // Delete a message from the chat room.
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