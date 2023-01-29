import React, { useEffect, useState, useRef } from 'react';
import ChatFooter from './components/ChatFooter';
import NavBar from "../NavBar/NavBar"
import ChatBar from './components/ChatBar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate , useLocation} from 'react-router-dom';
import { auth, db } from '../../firebase/functions';
import ChatBody from './components/ChatBody';
import { query, collection, getDocs, orderBy } from 'firebase/firestore';
export default function Messenger({ socket }) {

  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const [users, setUsers] = useState([]); // socket user

  const lastMessageRef = useRef(null);
  const location = useLocation()
  const receiver  = location.state === null ? null : location.state.receiver
  const room  = location.state === null ? null : location.state.room
  const [user, loading, error] = useAuthState(auth);
  const idRoom = room !== undefined ? room : receiver === null  ? null : user === null ? null : user.uid > receiver.uid ? `${user.uid}-${receiver.uid}` : `${receiver.uid}-${user.uid}`

  const navigate = useNavigate();

  const getMessages = async () => { 
    setMessages([])
    const data = await query(collection(db, "messages" , idRoom , "chat") , orderBy("createdAt" , "asc"))
    const q = await getDocs(data)
    setMessages([...q.docs.map((doc) => ({...doc.data() , id: doc.id}))])
    console.log(messages)
  }

  useEffect(() => {
    if (user) {
      // maybe trigger a loading screen
      console.log(user.uid)
      // console.log(user)
      console.log(location)
      getMessages()
      socket.emit('newUser', user.uid);
    }
    if (error) navigate("/");
  }, [user, loading , socket]);

  useEffect(() => {
    socket.on('newUserResponse', (data) => setUsers(data));
  }, [socket, users]);
  
  useEffect(() => {
    if(receiver){
      console.log("receviecer ====================")
      console.log(receiver)
      console.log(room)
      console.log("receviecer ====================")
      

      socket.emit('create_room', idRoom)
      console.log("receiver id : " + JSON.stringify(receiver) , idRoom)
        getMessages()
    }
  } , [receiver])
  
  
  useEffect(() => {
    socket.on('enter_room', (data) => setMessages([]));
  }, [socket, messages]);

  useEffect(() => {
    socket.on('messageResponse', (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    socket.on('typingResponse', (data) => setTypingStatus(data));
  }, [socket]);


  return (
    <div>
      <div className="">
        <div className="min-w-full border rounded lg:grid lg:grid-cols-3">
          <div className="border-r border-gray-300 lg:col-span-1">
            
            
            <ChatBar socket={socket} user={user}/>
          </div>
          <div className="hidden lg:col-span-2 lg:block">
            <div className="w-full">
              
              <ChatBody socket={socket} messages={messages} user={user} receiver={receiver} room={room} typingStatus={typingStatus} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
