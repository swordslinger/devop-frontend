<template>
    <h2>Welcome to Individual chatroom </h2>
    <div v-if="loading">Loading chat room...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
    <div>   
        <h3> {{ chatRoomData.name }} </h3>
        <p> {{ chatRoomData.description }}</p>
    </div>
    </div>
</template>

<script>
export default {
    name: 'ChatRoomView',
    data(){
        return {
            chatRoomId: null,
            chatRoomData : {
                name: '',
                description: '',
                createdBy: '',
            },
            messages: [],
            newMessage: "",
            WebSocket: null,
            loading: true,
            error: null,
            message:"",
            successful:false,
            sendingMessage: false,
        }
    },
    computed: {
        currentUsername() {
            return  this.$store.state.auth.user.username
        }
    },
    created(){
        this.chatRoomId = this.$route.params.id
        this.fetchChatRoomDetails()
        //this.connectWebSocket()
    },
    beforeDestroy(){
       // this.disconnectWebSocket()
    },
    methods: {
        fetchChatRoomDetails(){
            this.loading = false

            this.$store.dispatch("chatRoom/getChatRoomById", this.chatRoomId).then((data) =>{
            this.chatRoomData = data
            //this.fetchMessages()
            //                            
            },(error) => {
                this.error = (error.response && error.response.data &&  error.response.data.message) || 
                    error.message || 
                    "Failed to load chat room details"
                this.loading = false
                console.error("Error fetching chat room details:", error)
            }
        )
        }

    }

}
</script>