import { getAuth, signInWithRedirect , signInWithPopup, signInWithEmailAndPassword , createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, GoogleAuthProvider } from "firebase/auth";
import { 
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import {db} from '../firebase/config';
import socketIO from 'socket.io-client';

import { popUpSuccess , popUpError } from "../utils/utils";
const auth = getAuth();
const provider = new GoogleAuthProvider();
const socket = socketIO.connect(process.env.REACT_APP_SOCKET_URL);



/** AUTHENTIFICATION */
const registerWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user;
    console.log(user);
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.email.split('@')[0],
        authProvider: "google",
        email: user.email,
        photoURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1024px-Default_pfp.svg.png',
        roles: 'USER_ROLES',
      });
    }
    popUpSuccess('Vous etes bien inscrit ! ')
  } catch (err) {
    console.error(err);
    popUpError(err.message);
  }
}

const logInWithEmailAndPassword = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      popUpSuccess('Connecté !')

  })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
      popUpError(errorMessage);

  });
}

const signInWithGoogle = async () => {
  // signInWithRedirect(auth, provider).then((data) => {
  //   console.log(data)
  // }); 
  // console.log(auth.currentUser)
  const googleProvider = new GoogleAuthProvider();
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        photoURL: user.photoURL,
        roles: 'USER_ROLES',
      });
    }
    socket.emit('newUser', user.uid);

    return user;
    
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}
/*** END  */

/** MESSAGES */
const FirebaseAddMessage = async (infos) => {
  const { from , to , message , room } = infos
  console.log(infos)
  await addDoc(collection(db, "messages" , room , 'chat'), {
    message,
    from,
    to,
    createdAt: Timestamp.fromDate(new Date())
  });
}


const getUsers = async () => {
  try {
    const usersCollectionRef = query(collection(db ,"users"), where("uid", "not-in", [auth.currentUser.uid]))
    const data = getDocs(usersCollectionRef)
    // .docs.map((doc) => ({...doc.data() , id: doc.id}))
    return new Promise ((resolve , reject) => {
      resolve(data)
    })
  } catch (err) {
    return new Promise ((resolve , reject) => {
      reject(err)
    })
  }
}


const listAllUsers = (nextPageToken) => {
  // List batch of users, 1000 at a time.
  getAuth()
    .listUsers(1000, nextPageToken)
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
        console.log('user', userRecord.toJSON());
      });
      if (listUsersResult.pageToken) {
        // List next batch of users.
        listAllUsers(listUsersResult.pageToken);
      }
    })
    .catch((error) => {
      console.log('Error listing users:', error);
    });
};


const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const logout = () => {
  socket.emit("deleteUserConnected" , auth.currentUser.uid)
  signOut(auth);
  popUpSuccess("Deconnecté !")
};

const addWaiting = async (data) => {
  const { 
    from,
    fromName,
    to,
    toName
  } = data
  
  try{
    await addDoc(collection(db, "waiting"), {
      status: false,
      from,
      fromName,
      to,
      toName,
      createdAt: Timestamp.fromDate(new Date())
    });
    popUpSuccess('Demande envoyée !')
  } catch(err) {
    popUpError(err.message)
  }
}

const validationWaiting = async (id) => {
  const waitingCollectionRef = doc(db ,"waiting" , id)
  try {
    await updateDoc(waitingCollectionRef , {
      status: true,
    });
    popUpSuccess('Mis à jour!')
  } catch(err) {
    popUpError(err.message)
  }
}

const refusedWaiting = async (id) => {
  const waitingCollectionRef = doc(db ,"waiting" , id)
  try {
    await updateDoc(waitingCollectionRef , {
      status: "REFUSED",
    });
    popUpSuccess('Conversation refusé !')
  } catch(err) {
    popUpError(err.message)
  }
}

const addSessions = async (data) => {
  const { name, participants , nbVolumeMax } = data

  try{
    await addDoc(collection(db, "sessions" ), { 
      uid: Math.random(),
      name, 
      participants , 
      nbVolumeMax, 
      createdAt: Timestamp.fromDate(new Date())
    });

    popUpSuccess('Session créée')
  } catch(err) {
    popUpError(err.message)
  }
  
}

const addUserInSessions = async (data) => {
  const { idSession  , participants} = data
  const SessionsCollectionRef = doc(db ,"sessions" , idSession)

  try{
    await updateDoc(SessionsCollectionRef, { 
      participants, 
    });

    popUpSuccess('Vous avez ete ajouté correctement au groupe ' + idSession)
  } catch(err) {
    popUpError(err.message)
  }
  
}

const updateSessions = async (data) => {
  const { id, name, participants , nbVolumeMax } = data
  const SessionsCollectionRef = doc(db ,"sessions" , id)
  try{
    await updateDoc(SessionsCollectionRef, { 
      name, 
      participants , 
      nbVolumeMax, 
    });

    popUpSuccess('Session mise à jour')
  } catch(err) {
    popUpError(err.message)
  }
  
}

const deleteSessions = async (id) => {
  try{
    await deleteDoc(doc(db, "sessions", id));
    popUpSuccess('Session supprimé !')
  } catch(err) {
    popUpError(err.message)
  }
} 


export {
  auth,
  db,
  getUsers,
  updateSessions,
  FirebaseAddMessage,
  signInWithGoogle,
  addWaiting,
  validationWaiting,
  refusedWaiting,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  addSessions,
  deleteSessions,
  addUserInSessions
};