import React, { useEffect, useState } from "react";
import ChatBody from "../MessengerTemplate/components/ChatBody";
import "./chatbot.css";
import ChatFooterBot from "./components/ChatFooterBot";
import { getUsers, db, auth } from "../../firebase/functions";

export default function ChatBot({ socket }) {
  const [isModal, setIsModal] = useState("");
  const [messages, setMessages] = useState([
    {
      uid: "chatbot",
      name: "MotorService Bot",
      message: "Cliquez pour commencer",
      type: "button",
      value: "start",
    },
  ]);
  const [message, setMessage] = useState('')


  const openModal = () => {
    setIsModal(!isModal);
  };

  const responseFooter = (e) => {
    e.preventDefault();
    var p = {
      uid: auth.currentUser.uid,
      name: auth.currentUser.displayName,
      message,
      type: "text",
    };
    setMessages([...messages , p])
    console.log(messages);

    socket.emit("chatbot", message);
  };

  const responseMessage = (value) => {
    console.log(value);
    var p = {
      uid: auth.currentUser.uid,
      name: auth.currentUser.displayName,
      message: value,
      type: "text",
      value: "start",
    };
    setMessages([...messages , p])
    console.log(messages);

    socket.emit("chatbot", value);
  };

  useEffect(() => {
    socket.on("chatbotResponse", (data) => setMessages([...messages, ...data]));
  }, [socket, messages]);

  useEffect(() => {
    socket.on("chatbotClose", (data) => setMessages([...data]));
  }, [socket, messages]);

  return (
    <div class="first-plan">
      <button
        type="button"
        onClick={openModal}
        class="transition delay-150 duration-300 ease-in-out custom-around text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium text-sm px-5 py-2.5 
            text-center purple:bg-purple-600 purple:hover:bg-purple-700 purple:focus:ring-purple-900"
      >
        <div className="flex flex-row items-center justify-around">
          <span>Pose tes questions a notre bot !</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
            />
          </svg>
        </div>
      </button>
      <div style={{ backgroundColor: "white" ,
        display: isModal === true ? "block" : "none",
        width: "400px",
      }}>
        <div className="w-full">
          <div>
            <div className="relative w-full p-6 overflow-y-auto max-h-80">
            {messages.map((message) =>
                message.uid === "chatbot" ? (
                  <li className="flex justify-start">
                    {
                      message.type == "button" ? (
                        <>
                          <button
                            type="button"
                            class="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                            onClick={() => responseMessage(message.value)}
                            value={message.value}
                          >
                            {message.message}
                          </button>{" "}
                          <br />
                        </>
                      ) : message.type == "text" ? (
                        <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                          <p>{message.name}</p>
                          <span className="block">
                          {message.message}
                          </span>
                        </div>
                      ) : ''
                    }
                    
                  </li>
                ) : (
                  <li className="flex justify-end">
                    <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                      <p>{message.name}</p>
                      <input
                        type={message.type}
                        className="block"
                        value={message.message}
                      />
                    </div>
                  </li>
                )
            )}
            </div>
            <form className="form" onSubmit={responseFooter}>
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
        </div>
      </div>
    </div>
  );
}
