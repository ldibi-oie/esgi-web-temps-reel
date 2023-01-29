import React , {useEffect , useState} from 'react'
import { Link } from 'react-router-dom'
import { addFriend , addWaiting , auth, db , addUserInSessions} from '../../firebase/functions'
import { useAuthState } from 'react-firebase-hooks/auth';
import { query, collection, where, getDocs } from 'firebase/firestore';

export default function CardSession({ infos , socket }) {
    const [waitingList , setWaitingList] = useState([]);
    const [idwaitingList , setWaitingListID] = useState([]);
    const [justJoin , setJustJoin] = useState(false);
    
    const getWaitingStatus = async () => {
        try {
            const waitingCollectionRef = await query(collection(db ,"waiting") , where("from" , "in" , [auth.currentUser.uid]))
            const data = await getDocs(waitingCollectionRef)
            setWaitingList(...data.docs.map((doc) => ({
                ...doc.data() , 
                name: doc.id,
                status: doc.data().status
            })))
            
            waitingList.forEach((item) => {
                setWaitingListID(item.to)
            })

          } catch (err) {
            // alert(err.message)
        }
    }

    

    useEffect(() => {
        getWaitingStatus()
        console.log(waitingList)
        console.log(infos)
    }, [])

    const sendRequest = (idSession , idUser , participants) => {
        
        participants.push(idUser)
        console.log(idSession , participants)
        addUserInSessions({idSession , participants})
        setJustJoin(!justJoin)

        // socket.emit('enter_room', name);
    }   
    
    // const isAsking = (id) => {
    //     waitingList.forEach((item , index) => {
    //         if (item === id ) {
    //             waitingList[index]["isAsking"] = true
    //         } else {
    //             waitingList[index]["isAsking"] = false
    //         }
    //     })
    // }
    

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md purple:bg-gray-800 purple:border-gray-700 m-3">
        <div className="flex justify-end px-4 pt-4">
            <button id="dropdownButton" data-dropdown-toggle="dropdown" className="inline-block text-gray-500 purple:text-gray-400 hover:bg-gray-100 purple:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 purple:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
                <span className="sr-only">Open dropdown</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>
            </button>
            <div id="dropdown" className="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded shadow w-44 purple:bg-gray-700">
                <ul className="py-1" aria-labelledby="dropdownButton">
                <li>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 purple:hover:bg-gray-600 purple:text-gray-200 purple:hover:text-white">Edit</a>
                </li>
                <li>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 purple:hover:bg-gray-600 purple:text-gray-200 purple:hover:text-white">Export Data</a>
                </li>
                <li>
                    <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 purple:hover:bg-gray-600 purple:text-gray-200 purple:hover:text-white">Delete</a>
                </li>
                </ul>
            </div>
        </div>

        <div className="flex flex-col items-center pb-10">
            <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={infos.photo} alt="Bonnie image"/>
            <h5 className="mb-1 text-xl font-medium text-gray-900 purple:text-white">{infos.name}</h5>
            <span className="text-sm text-gray-500 purple:text-gray-400">{infos.roles === "USER_ROLES" ?  "Utilisateur" : "Conseiller"}</span>
            <div className="flex mt-4 space-x-3 md:mt-6">
                {
                    infos.inGroup === true || justJoin === true ? (
                        <>
                            {/* <button onClick={() => addFriendFunction(infos)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 purple:bg-blue-600 purple:hover:bg-blue-700 purple:focus:ring-blue-800">Add friend</button> */}
                            <Link to={`/messenger/`} state={{ receiver: infos }} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 purple:bg-gray-800 purple:text-white purple:border-gray-600 purple:hover:bg-gray-700 purple:hover:border-gray-700 purple:focus:ring-gray-700">Message</Link>
                        </>
                    ) : infos.numberParticipants === parseInt(infos.volumes) ? "Discussion complete" : 
                    (
                        <button onClick={() => sendRequest(infos.id , auth.currentUser.uid , infos.participants)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 purple:bg-blue-600 purple:hover:bg-blue-700 purple:focus:ring-blue-800"> Rejoindre</button>
                    )
                }
            </div>
            <div className="flex mt-4 space-x-3 md:mt-6">
                <span>Membres : {infos.numberParticipants}/{infos.volumes}</span>
            </div>
        </div>
    </div>
  )
}
