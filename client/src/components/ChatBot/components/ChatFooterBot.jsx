import React from 'react'
import { useState } from 'react';
import { getUsers, db, auth } from "../../../firebase/functions";

export default function ChatFooterBot({socket}) {
    const [message , setMessage] = useState('')

    const handleSendMessage = () => {
        console.log(message)
    }

    const responseMessage = (e) => {
        e.preventDefault();

        console.log(message);
        var p = {
          uid: auth.currentUser.uid,
          name: auth.currentUser.displayName,
          message,
          type: "string",
          value: "start",
        };
        // setMessages([...messages , p])
        // console.log(messages);
    
        socket.emit("chatbotFooter", {message , rep: p});
        socket.emit('chatbot' , "verify_year")
    };
    

  return (
    <div>
    <form className="form" onSubmit={responseMessage}>
        <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
            <input
                type="text"
                placeholder="Write message"
                className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                // onKeyDown={handleTyping}
            />
            <button type="submit">
                <svg className="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20" fill="currentColor">
                <path
                    d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
            </button>
        </div>
    </form>
    </div>
  )
}
