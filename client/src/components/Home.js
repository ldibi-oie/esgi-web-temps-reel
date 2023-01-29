import React, { useState , useEffect } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { useNavigate } from 'react-router-dom';
import CardProfile from "./general/CardProfile"
import {logout, signInWithGoogle , auth ,getUsers} from '../firebase/functions'
import { collection , getDocs , query , where} from 'firebase/firestore';
import { db } from '../firebase/functions';
import NavBar from './NavBar/NavBar';
import { useAuthState } from "react-firebase-hooks/auth";
import CardSession from './general/CardSession';

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
  { name: 'Dashboard', href: '/', current: true },
  // { name: 'Team', href: '#', current: false },
  // { name: 'Projects', href: '#', current: false },
  // { name: 'Calendar', href: '#', current: false },
  { name: 'Mes messages', href: '/', current: false },
  { name: 'Deconnexion', href: '/', current: false  , action: logout},
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' ,  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home({socket}) {
  const [user, loading, error] = useAuthState(auth); // user current
  const [FireBaseUsers , setFireBaseUsers] = useState([]); // users on app 
  const [sessions , setSessions] = useState([]); // groupes creer par admins
  const [users, setUsers] = useState([]); // socket user
  const navigate = useNavigate();

  const getSessions = async () => {
    const sessionsCollectionRef = await query(collection(db ,"sessions"))
    const data = await getDocs(sessionsCollectionRef)
    setSessions(data.docs.map((doc) => ({...doc.data() , id: doc.id})))
    console.log(sessions)
  }

  // useEffect(() => {
  //   socket.emit('newUser', user.uid);
  // }, [socket, users]);

  useEffect(() => {
    socket.on('newUserResponse', (data) => setUsers(data));
  }, [socket, users]);

  useEffect(() => {
    if (user) {
      // maybe trigger a loading screen
      // console.log(user)

      const getAllUsers = async () => {
        const usersCollectionRef = await query(collection(db ,"users"), where("uid", "!=", user.uid))
        const data = await getDocs(usersCollectionRef)
        setFireBaseUsers(data.docs.map((doc) => ({...doc.data() , id: doc.id})))
      }
      getAllUsers()
      getSessions()
      socket.emit('newUser', user.uid);
      
    }
    if (loading) navigate("/");
    
    console.log(FireBaseUsers)
  }, [user, loading]);

  const handleSubmit = (user) => {
    //sends the username and socket ID to the Node.js server
    // navigate('/chat');
  };

  return (
    <>
      <div className="min-h-full">

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            {/* <h1 className="text-3xl font-bold tracking-tight text-gray-900">{auth.currentUser.displayName ? 'Welcome , ' + auth.currentUser.displayName : ''}</h1> */}
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 my-3">
            <h6 className="text-3xl font-bold tracking-tight text-gray-900">Les utilisateurs </h6>

            <div className="flex flex-row">

              {
                FireBaseUsers.map((item) => {
                  return (
                    <>
                     <CardProfile infos={{
                        name: item.name,
                        roles: item.roles,
                        photo: item.photoURL ? item.photoURL : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                        id: item.uid
                      }}/>
                    </>
                  )
                })
              }
              

            </div>

            {
              sessions.length > 0 ? (
                <h6 className="text-3xl font-bold tracking-tight text-gray-900">Les salons generales</h6>

              ) : ''
            }

            <div class="flex flex-row wrqp">
              {
                sessions.map((item) => {
                  return (
                    <>
                     <CardSession infos={{
                        name: item.name,
                        volumes: item.nbVolumeMax,
                        photo: item.photoURL ? item.photoURL : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                        id: item.id,
                        inGroup: item.participants.includes(user.uid) === true ? true : false,
                        numberParticipants: item.participants.length,
                        participants: item.participants
                      }}
                      
                      socket={socket}/>
                    </>
                  )
                })
              }
              

            </div>

            {/* <div className="px-4 py-6 sm:px-0">
              <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
            </div> */}

            {/* /End replace */}
          </div>
        </main>
      </div>
    </>
  )
}
