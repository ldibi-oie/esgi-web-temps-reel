import { Server } from "socket.io-client";
const socket = io(URL, { autoConnect: false });

const io = new Server(3000 , {
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection" , () => {
    console.log("New Client")
})


export default socket;