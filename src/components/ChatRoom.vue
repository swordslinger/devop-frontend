
<template>
    <div>
        <h2>Chat Rooms</h2>

     <!--   <div v-if="chatRooms.length > 0">
     <!--       <div v-for="room in chatRooms" :key="room.id">
       <!--         {{ room.name }}
         <!--       <button @click="joinRoom(room.id)">Join</button>
           <!--      <button @click="leaveRoom(room.id)">Leave</button> -->
          <!--       <button @click="deleteRoom(room.id)">Delete</button> -->
              <!--   <button @click="navigateToRoom(room.id)">Navigate</button> -->
     <!--        </div>
        </div>
        <div v-else> No chat rooms available </div> -->

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
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

export default {
    components: {
        Form,
        Field,
        ErrorMessage
    },
    data(){
        return {
            schema: yup.object().shape({
                roomName: yup.string().required('Room name is required'),
                roomDescription: yup.string().required('Room description is required')
            }),
            message:"",
            successful:false,
            loading: false,
        }

    },
    created(){
        console.log('Auth state on created', this.$store.state.auth)
    },
    methods: {
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