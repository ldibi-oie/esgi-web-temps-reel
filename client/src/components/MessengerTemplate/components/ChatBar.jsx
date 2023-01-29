import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { getUsers , db, auth} from '../../../firebase/functions';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { popUpSuccess , popUpError } from '../../../utils/utils';

const ChatBar = ({ socket }) => {
  const [user, loading, error] = useAuthState(auth);
  const [users, setUsers] = useState([]);
  const [userLogg, setLogg] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [waitingList , setWaitingList] = useState([]);
  const [idwaitingList , setWaitingListID] = useState([]);

  const [activeRoom, setActiveRoom] = useState("");
  const messagesCollectionRef = collection(db, "messages")
  const getSessions = async () => {
    const sessionsCollectionRef = await query(collection(db ,"sessions"))
    const data = await getDocs(sessionsCollectionRef)
    setSessions(data.docs.map((doc) => ({...doc.data() , id: doc.id})))
  }

  

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // maybe trigger a loading screen
      // console.log(user)
      const getAllUsers = async () => {
        const usersCollectionRef = await query(collection(db ,"users"), where("uid", "!=", user.uid))
        const data = await getDocs(usersCollectionRef)
        setUsers(data.docs.map((doc) => ({...doc.data() , id: doc.id})))
      }
      getAllUsers()
      getSessions()

      const getWaitingStatus = async () => {
        console.log(user)
        const waitingCollectionRef = await query(collection(db ,"waiting") , where("from", "==", user.uid))
        const data = await getDocs(waitingCollectionRef)
        setWaitingList(data.docs.map((doc) => ({
            ...doc.data(), id: doc.id
            // status: doc.data().status
        })))
        console.log(waitingList)
        
        for(var i = 0; waitingList.length > i; i++){
          console.log(waitingList[i].status)
          if (waitingList[i].status === true) return;
          setWaitingListID(waitingList[i].to)
        }
      }
      getWaitingStatus()
    }
    
  }, [user, loading]);

  useEffect(() => {
    socket.on('newUserResponse', (data) => {
      setLogg(data)
    });

    // console.log(users , idwaitingList)    
  }, [socket, users ]);
  
  const enterRoom = (id) => {
    // socket.emit("leave_room" , activeRoom)
    const idRoom = user.uid > id ? `${user.uid}-${id}` : `${id}-${user.uid}`
    console.log(idRoom)
    socket.emit("enter_room" , idRoom)

    // setActiveRoom(id)
  }

  const enterRoomSession = (name) => {
    // socket.emit("leave_room" , activeRoom)
    socket.emit("enter_room" , name)
    // setActiveRoom(id)
  }

  const searchBarFunc = (event) => {
    console.log(event.target.value)
    
    // Declare variables
    // var input, filter, ul, li, a, i, txtValue;
    // input = document.getElementById('searchBar');
    // filter = input.value.toUpperCase();
    // ul = document.getElementById("myUL");
    // li = ul.getElementsByTagName('li');
  
    // // Loop through all list items, and hide those who don't match the search query
    // for (i = 0; i < li.length; i++) {
    //   a = li[i].getElementsByTagName("a")[0];
    //   txtValue = a.textContent || a.innerText;
    //   if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //     li[i].style.display = "";
    //   } else {
    //     li[i].style.display = "none";
    //   }
    // }
  }

  return (
    <>
      <div className="mx-3 my-3">
        <div className="relative text-gray-600">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              viewBox="0 0 24 24" className="w-6 h-6 text-gray-300">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </span>
          <input type="search" id="searchBar" className="block w-full py-2 pl-10 bg-gray-100 rounded outline-none" name="search"
            placeholder="Search" required />
        </div>
      </div>
      <ul class="overflow-none h-screen" id="myUL">
        <h2 class="my-2 mb-2 ml-2 text-lg text-gray-600">Chats</h2>
        {JSON.stringify(idwaitingList)}
          
          {users.map((user) => (
            <li>
        
            {
              idwaitingList.includes(user.uid) != true ? (
                <>
                  <Link to={`/messenger/`} state={{ receiver: user }} onClick={() => enterRoom(user.uid)} key={user.socketID}
                    class="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none">
                   <div class="w-full pb-2">
                    
                    <div className="relative flex items-center p-3">
                      <img class="object-cover w-10 h-10 rounded-full"
                        src={user.photoURL === null ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1024px-Default_pfp.svg.png' :  user.photoURL } alt="username" />
                      <span className="block ml-2 font-bold text-gray-600">{user.name}</span>
                        <span className={ userLogg !== null ? userLogg.includes(user.uid) === true ? "absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3" : "absolute w-3 h-3 bg-red-600 rounded-full left-10 top-3" : ""}> 
                      </span>
                    </div>
                      <div class="flex justify-between">
                        {/* <span class="block ml-2 text-sm text-gray-600">25 minutes</span> */}
                      </div>
                      {/* <span class="block ml-2 text-sm text-gray-600">last message ahahaha</span> */}
                    </div>
                    {/* <span span className=" w-5 h-5 bg-red-600 rounded-full left-10 top-3 flex row justify-center items-center text-white"><p>8</p></span> */}

                    {/* {userLogg.length > 0 ? userLogg.includes(user.uid) ? "connected" : "deconnected" : ''} */}
                  </Link>
                </>
              ) : ''
            }
              
            </li>
          ))}

        {
          sessions.length > 0 ? (
            <h2 class="my-2 mb-2 ml-2 text-lg text-gray-600">Chats prédefinis</h2>
          ) : ''
        }
        <li>
          
          {sessions.map((session) => (
            <>
            <Link to={`/messenger/`} state={{ receiver: session , room: session.name }} onClick={() => enterRoomSession(session.name)} key={session.id}
              class="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none">
              <div className="flex items-center p-3">
                <div className="relative flex items-center justify-between  p-3">
                  <img class="object-cover w-10 h-10 rounded-full"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1024px-Default_pfp.svg.png" alt="username" />
                  <span className="block ml-2 font-bold text-gray-600">{session.name}</span>
                    {/* <span className={ userLogg !== null ? userLogg.includes(user.uid) === true ? "absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3" : "absolute w-3 h-3 bg-red-600 rounded-full left-10 top-3" : ""}> 
                  </span> */}

                </div>
                {/* <span className=" w-5 h-5 bg-red-600 rounded-full left-10 top-3 flex row justify-center items-center text-white"><p>8</p></span> */}
              </div>

              
            </Link>
          </>
          ))}
        </li>
      </ul>
    </>
  );
};
export default ChatBar;