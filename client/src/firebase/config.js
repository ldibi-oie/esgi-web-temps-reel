import { initializeApp } from "firebase/app"
import { 
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc
} from "firebase/firestore";

import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBw8OO0grsulO05ExnAQDmKtzizrTvjEno",
  authDomain: "messenger-db-55180.firebaseapp.com",
  projectId: "messenger-db-55180",
  storageBucket: "messenger-db-55180.appspot.com",
  messagingSenderId: "157209763868",
  appId: "1:157209763868:web:41f92f6c5c9ed34ad07fd9"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export {db}