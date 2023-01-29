import React  , {useEffect , useState} from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {db} from '../firebase/config'
import {signInWithGoogle , auth, registerWithEmailAndPassword , logInWithEmailAndPassword, sign} from '../firebase/functions'
import {    } from 'firebase/auth';
import { getAuth, signInWithRedirect , signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./Login.css"

export default function Login({socket}) {
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState('')
  const [emailAlready, setEmailAlready] = useState('')
  const [password, setPassword] = useState('');
  const [passwordAlready, setPasswordAlready] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) {
      navigate("/home")
    };

  }, [user, loading]);
  

  const login = async () => {
    signInWithGoogle()
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    registerWithEmailAndPassword(email , password)
  }

  const loginForm = async () => {
    console.log(emailAlready , passwordAlready)
    logInWithEmailAndPassword(emailAlready , passwordAlready)
  }

  return (
    <div class="center-screen">
      <div class="w-full max-w-xl space-y-8">
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Bienvenue sur MotorService</h2> <br />
        <button type="submit" onClick={login} class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Connexion via Google
        </button>
        <span className="p-5"> ou bien via formulaire </span>

        <div className="flex flex-row">
          <div className="m-5 p-5">

            <span className="m-5"> Connectez vous ! </span>
            <div>
              <label for="email-address" class="sr-only">Email address</label>
              <input id="email-address" name="email" value={emailAlready} onChange={(e) => setEmailAlready(e.target.value)} type="email" autocomplete="email" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Email address"/>
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input id="password" name="password" value={passwordAlready} onChange={(e) => setPasswordAlready(e.target.value)} type="password" autocomplete="current-password" required class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Password"/>
            </div>
            <button type="submit" onClick={loginForm}  class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              connexion
            </button>
            
          </div>
          
          <div class="m-5 p-5">
            <span className="m-5"> Ou inscrivez vous !</span>

            <div>
              <label for="email-address" class="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autocomplete="email" required class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Email address"/>
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autocomplete="current-password" required class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Password"/>
            </div>
            <button type="submit" onClick={onSubmit} class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              inscription
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
