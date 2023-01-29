import React , {useEffect , useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ChatFooter from './ChatFooter';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';
// typingStatus, lastMessageRef 
const ChatBody = ({ socket , messages , user , receiver = null , room = null  , typingStatus}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // socket user

  const handleLeaveChat = () => {
    localStorage.removeItem('userName');
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    socket.on('newUserResponse', (data) => setUsers(data));
  }, [socket, users]);

  useEffect(() => {
    console.log(room)
    console.log(messages)
  }, [])

  

  return (
    <div style={{display: receiver === null ? 'none' : ''}}>
      <div className="relative flex items-center p-3 border-b border-gray-300">
        <img className="object-cover w-10 h-10 rounded-full"
          src={receiver === null ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1024px-Default_pfp.svg.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1024px-Default_pfp.svg.png'} alt="username" />
        <span className="block ml-2 font-bold text-gray-600">{receiver === null ? '' : receiver.name}</span>
        <span className={ receiver !== null ? users.includes(receiver.uid) === true ? "absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3" : "absolute w-3 h-3 bg-red-600 rounded-full left-10 top-3" : ""}> 
        </span>
      </div>
      <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
        <ul className="space-y-2">
          {messages.map((message) =>
            message.from === user.uid ? (
              <li className="flex justify-end">
                <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow" key={message.id}>
                  <p>{message.name}</p>
                  <span className="block">{message.message}</span>
                </div>
              </li>
            ) : (
              <li className="flex justify-start">
                <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow" key={message.id}>
                  <p>{message.name}</p>
                  <span className="block">{message.message}</span>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
      {/* <div className="message__status">
        <p>{typingStatus}</p>
      </div> */}
      <ChatFooter socket={socket} user={user} receiver={receiver} room={room}/>
    </div>
  );
};
export default ChatBody;