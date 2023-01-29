import { useEffect ,useState } from 'react';
import { BrowserRouter, Routes, Route ,useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import Protected from './utils/Protected';
import Home from './components/Home';
import ChatPage from './components/ChatPage';
import Login from './components/Login';
import Messenger from './components/MessengerTemplate/Messenger';
import NavBar from './components/NavBar/NavBar';
import PrivateMessage from './components/MessengerTemplate/PrivateMessage';
import { auth, db } from './firebase/functions';
import { getUser } from './utils/utils';
import socketIO from 'socket.io-client';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Admin from './components/Admin/Admin';
import AdminUsers from './components/Admin/components/AdminUsers';
import AdminSessions from './components/Admin/components/AdminSessions';
import AdminWaiting from './components/Admin/components/AdminWaiting';
import ErrorPage from './components/general/ErrorPage';
import Validated from './components/Admin/components/Validated';
import Refused from './components/Admin/components/Refused';
import ChatBot from './components/ChatBot/ChatBot'
// const dotenv = require('dotenv')

// require('dotenv').config()
const socket = socketIO.connect(process.env.REACT_APP_SOCKET_URL);
function App() {
  const [user, loading, error] = useAuthState(auth);
  const [infos, setInfos] = useState([]);
  const [isAdmin, setAdmin] = useState('');
  const [userName, setUserName] = useState('');
  

  useEffect(() => {
    if (user) {
      // maybe trigger a loading screen
      console.log(user)
      getAdmin(user)
    }
  }, [user]);

  const getAdmin = async (user) => {
      try {
        const usersCollectionRef = await query(collection (db ,"users"), where("uid" , "==" , user.uid))
        const data = await getDocs(usersCollectionRef)
        setAdmin(...data.docs.map((doc) => ({...doc.data() , id: doc.id})))

        if(infos.roles === "ADMIN_ROLES"){
          setAdmin(true)
        }
      }catch (err) {
        alert(err.message)
      }
  }

  return (
    <BrowserRouter>
      <div>
        <NavBar user={user} isAdmin={isAdmin.roles} isDisplay={user === null ? false : true} socket={socket} />
        <Routes>
          <Route path="/" element={<Login socket={socket}/>}></Route>
          <Route path="/home" element={<Home socket={socket}/>}></Route>
          <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
          <Route path="/messenger" element={<Messenger socket={socket} />}></Route>
          <Route path="/messenger/:id" element={<PrivateMessage socket={socket} />}></Route>
          <Route path="/error" element={<ErrorPage />}></Route>

          <Route path="/admin" element={
            <Protected isSignedIn={isAdmin.roles}>
              <Admin />
            </Protected>
          }/>
          <Route path="/admin" element={
            <Protected isSignedIn={isAdmin.roles}>
              <Admin />
            </Protected>
          }/>
          <Route path="/admin/users" element={
            <Protected isSignedIn={isAdmin.roles}>
            <AdminUsers isAdmin={isAdmin} />
            </Protected>
          }></Route> 
          <Route path="/admin/waiting" element={
            <Protected isSignedIn={isAdmin.roles}>
            <AdminWaiting isAdmin={isAdmin} />
            </Protected>
          }></Route> 
          <Route path="/admin/sessions" element={
            <Protected isSignedIn={isAdmin.roles}>
            <AdminSessions isAdmin={isAdmin} />
            </Protected>
          }></Route> 
          <Route path="/admin/waiting/validated" element={
            <Protected isSignedIn={isAdmin.roles}>
              <Validated />
            </Protected>
          }></Route> 
          <Route path="/admin/waiting/refused" element={
            <Protected isSignedIn={isAdmin.roles}>
              <Refused />
            </Protected>
            
          }></Route> 
          
        </Routes>
        <ChatBot socket={socket} />
      </div>
    </BrowserRouter>
  );
}
export default App;