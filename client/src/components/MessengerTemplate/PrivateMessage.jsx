import React, { useEffect, useState, useRef } from 'react';
import ChatFooter from './components/ChatFooter';
import NavBar from "../NavBar/NavBar"
import ChatBar from './components/ChatBar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/functions';
import ChatBody from './components/ChatBody';
export default function PrivateMessage({ socket }) {

    const [messages, setMessages] = useState([]);
    const [typingStatus, setTypingStatus] = useState('');
    const lastMessageRef = useRef(null);

    const [user, loading, error] = useAuthState(auth);

    const navigate = useNavigate();
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
    <>
    <div>PrivateMessage id : </div>

    <div className="hidden lg:col-span-2 lg:block">
        <div className="w-full">
            <div className="relative flex items-center p-3 border-b border-gray-300">
            <img className="object-cover w-10 h-10 rounded-full"
                src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg" alt="username" />
            <span className="block ml-2 font-bold text-gray-600">Emma</span>
            <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3">
            </span>
            </div>
            <ChatBody messages={messages} user={user} />
            <ChatFooter socket={socket} user={user}/>
        </div>
        </div>
    </>
  )
}
