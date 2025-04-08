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
                <div v-for="msg in messages" :key="msg.id" class="message" :class="{'own-message': msg.username === currentUsername}">
                    <div class="message-header">
                        <strong>{{ msg.user.username }}:</strong> {{ msg.content }}
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
        //this.connectWebSocket()
    },
    beforeDestroy() {
        // this.disconnectWebSocket()
    },
    methods: {
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
                chatRoomId: this.chatRoomId,
                content: this.newMessage.trim(),
                username: this.currentUsername,
                timestamp: new Date().toISOString()

            }

            const messageContent = this.newMessage.trim()
            this.newMessage = ""


            this.$store.dispatch("message/sendMessage", messageData)
                .then(() => {
                    this.message = "message sent successfuly",
                    this.successful = true

                }).catch((error) => {
                            this.message = (error.response && error.response.data && error.response.data.message) ||
                                error.message ||
                                "Failed to send message"
                            this.successful = false
                            console.error("Error sending message: ", error)

                            this.newMessage = messageContent
                        })
                    .finally(()=> {
                        this.sendingMessage = false
                    })
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
        }

    }

}
</script>