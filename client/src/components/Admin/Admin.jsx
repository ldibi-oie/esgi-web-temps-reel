import React, { useState , useEffect } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { useNavigate } from 'react-router-dom';
import CardProfileAdmin from '../general/CardProfileAdmin';
import {logout, db, signInWithGoogle , auth ,getUsers} from '../../firebase/functions'
import { collection , getDocs , query , where} from 'firebase/firestore';
import NavBar from '../NavBar/NavBar';
import { useAuthState } from "react-firebase-hooks/auth";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Admin() {
  const [user, loading, error] = useAuthState(auth);
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      // maybe trigger a loading screen
      console.log(user)
      const getAllUsers = async () => {
        const usersCollectionRef = await query(collection(db ,"users"), where("uid", "!=", user.uid))
        const data = await getDocs(usersCollectionRef)
        setUsers(data.docs.map((doc) => ({...doc.data() , id: doc.id})))
      }
      getAllUsers()
      console.log(users)
      // console.log(isAdmin)
    }
    // if (isAdmin === '') navigate("/")
    
  }, [user, loading]);

  const handleSubmit = (user) => {
    //sends the username and socket ID to the Node.js server
    // navigate('/chat');
  };

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            {/* <h1 className="text-3xl font-bold tracking-tight text-gray-900">{auth.currentUser.displayName ? 'Welcome , ' + auth.currentUser.displayName : ''}</h1> */}
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 my-3">
            <h6 className="text-3xl font-bold tracking-tight text-gray-900">Welcome , {user.email}</h6>
            {/* <h6 className="text-3xl font-bold tracking-tight text-gray-900">Les conseillers </h6> */}

            <div className="flex flex-row overflow-x">
            
              <CardProfileAdmin infos={{
                  name: 'GERE LES UTILISATEURS',
                  roles: '',
                  url: '/admin/users',
                  buttonName: 'Go',
              }}/>

              <CardProfileAdmin infos={{
                  name: 'GERER LES DEMANDES',
                  url: '/admin/waiting',
                  roles: '',
                  buttonName: 'Go',
              }}/>

              <CardProfileAdmin infos={{
                  name: 'GERER LES SESSIONS',
                  url: '/admin/sessions',
                  roles: '',
                  buttonName: 'Go',
              }}/>

            </div>
            {/* /End replace */}
          </div>
        </main>
      </div>
    </>
  )
}
