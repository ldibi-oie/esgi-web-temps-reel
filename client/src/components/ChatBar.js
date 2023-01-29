import React, { useState, useEffect } from 'react';
import { getUsers } from '../firebase/functions';
const ChatBar = ({ socket }) => {
  const [users, setUsers] = useState([]);
  const [activeRoom, setActiveRoom] = useState("");
  useEffect(() => {
    socket.on('newUserResponse', (data) => setUsers(data));
  }, [socket, users]);

  
  
  const enterRoom = (id) => {
    // socket.emit("leave_room" , activeRoom)
    console.log(id)
    socket.emit("enter_room" , "salon" + id)
    // setActiveRoom(id)
  }

  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>
      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
            {users.map((user) => (
              <button type="button" onClick={enterRoom(user.socketID)} key={user.socketID}>{user.userName}</button>
            ))}
        </div>
      </div>
    </div>
  );
};
export default ChatBar;