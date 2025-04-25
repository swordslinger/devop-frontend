
<template>
    <div>
        <h2>Chat Rooms</h2>

        <!-- Display existing chatrooms   -->
        <div v-if="chatRooms.length > 0">
            <div v-for="room in chatRooms" :key="room.id">
                {{ room.name }}
                <button @click="joinRoom(room.id)">Join</button>
                 <button @click="leaveRoom(room.id)">Leave</button> 
                 <button @click="deleteRoom(room.id)">Delete</button> 
                 <button @click="navigateToRoom(room.id)">Navigate</button> 
             </div>
        </div>

        <!-- If no chatrooms exist display this message   -->
        <div v-else> No chat rooms available </div> 

        <!-- Form to create a new chatroom   -->
        <Form @submit="createChatRoom" :validation-schema="schema">
            <div>
                <label for="roomName">Room Name:</label>
                <Field name="roomName" type="text" />
                <ErrorMessage name="roomName" />

                <label for="roomDescription">Room Description:</label>
                <Field name="roomDescription" type="text" />
                <ErrorMessage name="roomDescription" />

                <button :disabled="loading">
                    <span v-show="loading"></span>
                    Create Room
                </button>
            </div>
        </Form>
    </div>

    <!-- Display success or error message after creating a room   -->
    <div v-if="message" :class="successful ? 'alert-success' : 'alert-danger'">
    {{ message }}
  </div>
</template>

<script>
// Imports.
import { chatRoom } from '@/store/chatRoomModule';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

// Register vee-validate components
export default {
    components: {
        Form,
        Field,
        ErrorMessage
    },
    data(){
        return {
            // Validation schema for the form.
            chatRooms: [],
            schema: yup.object().shape({
                roomName: yup.string().required('Room name is required'),
                roomDescription: yup.string().required('Room description is required')
            }),
            message:"",
            successful:false,
            loading: false,
        }

    },
    // Fetch all chat rooms when the component is created.
    created(){
        console.log('Auth state on created', this.$store.state.auth)
        this.fetchChatRooms()
    },
    methods: {
        // Enter a specfic chat room.
        navigateToRoom(roomId){
            this.loading = true
            try {
                this.$router.push(`/chatroom/${roomId}`)
            }catch (error){
                console.error("Error navigating to chat room:", error)
                this.message = "Failed to navigate to chat room."
                this.loading = false
            }finally {
                this.loading = false
            }
        },
        // Join a specific chat room.
        joinRoom(roomId){
            this.loading = true;
            this.$store.dispatch("chatRoom/joinChatRoom", roomId).then(()=>{
                this.message = "Joined chat room successfully!"
                this.successful = true
                this.loading = false
                this.fetchChatRooms()
            }).catch((error) => {
                this.message = (error.response && error.response.data &&  error.response.data.message) || 
                    error.message || 
                    error.toString()
                this.successful = false
                this.loading = false
            })
        },
        // Leave a specific chat room.
        leaveRoom(roomId){
            this.loading = true

            this.$store.dispatch("chatRoom/leaveChatRoom", roomId).then(()=>{
                this.message = "Left chat room successfully!"
                this.successful = true
                this.loading = false
                this.fetchChatRooms()
            }).catch((error) => {
                this.message = (error.response && error.response.data &&  error.response.data.message) || 
                    error.message || 
                    error.toString()
                this.successful = false
                this.loading = false
            })
        },
        // Delete a specific chat room.
        deleteRoom(roomId){
            this.loading = true

            this.$store.dispatch("chatRoom/deleteChatRoom", roomId).then(
                () => {
                    this.message = "Chat room deleted successfully!"
                    this.successful = true
                    this.loading = false
                    this.fetchChatRooms()
                },
                (error) => {
                    this.message = (error.response && error.response.data &&  error.response.data.message) || 
                        error.message || 
                        error.toString()
                    this.successful = false
                    this.loading = false
                }
            )
        },
        // Get all chat rooms from the store.
        fetchChatRooms() {
            this.loading = true
            this.$store.dispatch("chatRoom/getAllChatRooms").then(
                (data) => {
                    this.chatRooms = data
                    this.loading = false
                } ,
                (error) => {
                    console.error("Error fetching chat rooms:", error)
                    this.loading = false
                }
            )
        },
        // Create a new chat room.
        createChatRoom(roomData) {
            this.message = ""
            this.successful = false
            this.loading = true

            const chatRoom = {
                name: roomData.roomName,
                description: roomData.roomDescription,
                createdBy: this.$store.state.auth.user.username
            }

            this.$store.dispatch("chatRoom/createChatRoom", chatRoom).then(
                (data) => {
                    this.message = "Chat room created successfully!"
                    this.successful = true
                    this.loading = false
                },
                (error) => {
                    this.message = (error.response && error.response.data &&  error.response.data.message) || 
                        error.message || 
                        error.toString()
                    this.successful = false
                    this.loading = false
                }
            )
        }

    }

    
}
</script>