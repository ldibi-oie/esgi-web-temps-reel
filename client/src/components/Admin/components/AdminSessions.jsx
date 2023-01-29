import React , {useEffect , useState} from 'react'
import { query, collection, where, getDocs } from 'firebase/firestore';
import Validated from './Validated';
import Refused from './Refused';
import { db } from '../../../firebase/config';
import { addSessions , updateSessions, deleteSessions} from '../../../firebase/functions';
import { Link } from 'react-router-dom';
import ModalDelete from './Modal/modalDelete';
import { useForm, useWatch } from 'react-hook-form';
import { popUpError } from '../../../utils/utils';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminSessions({isAdmin}) {
    const [Sessions , setSessions] = useState([])
    const [users , setUsers] = useState([])
    const [isModal , setIsModal] = useState('')
    const [edit , setEdit] = useState([])
    const getSessions = async () => {
      try {
        const SessionsCollectionRef = await query(collection (db ,"sessions"))
        const data = await getDocs(SessionsCollectionRef)
        setSessions(data.docs.map((doc) => ({...doc.data() , id: doc.id})))
      }catch (err) {
        alert(err.message)
      }
    }

    const getUsers = async () => {
      try {
        const usersCollectionRef = await query(collection (db ,"users"))
        const data = await getDocs(usersCollectionRef)
        setUsers(data.docs.map((doc) => ({...doc.data() , id: doc.id})))
      }catch (err) {
        alert(err.message)
      }
    }

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm()

    const onSubmit = (data) => {
      const { name, participants , nbVolumeMax , id } = data
      var value = []
      var p = {
        name,
        nbVolumeMax,
      }

      console.log(data)

      // participants.forEach((nb) => {
      //   console.log(nb)
      //   console.log(users[nb])
      //   value.push(users[nb])
      // })

      // p["participants"] = value

      console.log(data , edit)
      if(edit.length === 0 ) {
        if (participants.length <= nbVolumeMax){

          addSessions(data).then((st) => {
              getSessions()
              openModal()
          })
        }  else { 
          popUpError("Le nombre max de participants est dépassé !")
        }
      }else {
        if (participants.length <= nbVolumeMax){
          updateSessions({...data , id: edit.id}).then((st) => {
            setEdit([])
            getSessions()
            openModal()
          })
        } else { 
          popUpError("Le nombre max de participants est dépassé !")
        }
      }
    };
    

    useEffect(() => {
        // if(!isAdmin) return;
        getSessions()
        getUsers()
        console.log(Sessions , users)
    } , [] )
    	
    const openModal = () => {
      // validationSessions(id)
    // console.log(id)
      var p = []
      setEdit(p)
      setIsModal(!isModal)
      reset({})
      console.log(edit)
      // reset({})
      
    }

    const modify = (item) => {
        // validationSessions(id)
      setEdit(item)
      setIsModal(!isModal)
      reset({
        name: item.name,
        nbVolumeMax: item.nbVolumeMax ,
        participants: item.participants,
  
      })
    }

    const deletePopUp = (id) => {
      // refusedSessions(id)
      console.log(id)
      deleteSessions(id)
      getSessions()
    }

    const navigation = [
      "id", "name", "nbVolumeMax"
    ]

    const navigationHeader = [
      { name: 'Creer un groupe de conversation', href: '', current: true , action: openModal},
      // { name: 'Demandes Refusées', href: '', current: true },
      // { name: 'Mes messages', href: '/messenger', current: false },
      // { name: 'Deconnexion', href: '/', current: false  , action: logout},
    ]

  return (
    <div className='container'>
      {
        isModal === true ? (
          <div class="relative z-10" >
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <div class="fixed inset-0 z-10 overflow-y-auto">
                  <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div class="sm:flex sm:items-start">
                          <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                          <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z" />
                          </svg>
                          </div>
                          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">Creer salon de discussion</h3>
                          <div class="mt-2">
                              <p class="text-sm text-gray-500">Remplissez les champs .</p>
                          </div>
                          </div>
                      </div>

                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900 purple:text-white">Nom de la conversation</label>
                            <input type="text" {...register("name", { required: true })} id="small-input" class="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 purple:bg-gray-700 purple:border-gray-600 purple:placeholder-gray-400 purple:text-white purple:focus:ring-blue-500 purple:focus:border-blue-500"/>
                        </div>

                        <label for="countries_multiple" class="block mb-2 text-sm font-medium text-gray-900 purple:text-white">Selectionner les membres</label>
                        <select {...register("participants", { required: true })} multiple id="countries_multiple" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 purple:bg-gray-700 purple:border-gray-600 purple:placeholder-gray-400 purple:text-white purple:focus:ring-blue-500 purple:focus:border-blue-500">
                          {
                            users.map((item , index) => (
                              <option key={index} value={item.uid}>{item.name} {item.roles === "USER_ROLES" ? "- Utilisateur" : item.roles === "ADMIN_ROLES" ? " - Administrateur" : ""}</option>
                            ))
                          }
                        </select>

                        <div>
                            <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900 purple:text-white">Nombre de participants maximum</label>
                            <input type="number" min="1" {...register("nbVolumeMax", { required: true })} id="small-input" class="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 purple:bg-gray-700 purple:border-gray-600 purple:placeholder-gray-400 purple:text-white purple:focus:ring-blue-500 purple:focus:border-blue-500"/>
                        </div>

                        
                        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          {
                            edit.length === 0 ? (
                              <button type="submit"  class="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">Enregistrer</button>

                            ) : (
                              <button type="submit" class="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">Mettre a jour</button>
                            )
                          }
                          <button type="button" onClick={openModal} class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Annuler</button>
                        </div>
                      </form>
                  </div>
                  </div>
                  </div>
              </div>
          </div>
        ) : ''
      }
        
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestions des sessions</h1>
        </div>
      </header>
      <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationHeader.map((item) => (
                <button
                    key={item.name}
                    className={classNames(
                    item.current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'px-3 py-2 rounded-md text-sm font-medium'
                    )}
                    style={{ display: item.display ? item.display : ''}}
                    aria-current={item.current ? 'page' : undefined}
                    onClick={item.action ? item.action : ''}
                >
                    {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      </header>
      <div class="m-5 overflow-x-auto relative container">
        <table class="w-full text-sm text-left text-gray-500 purple:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 purple:bg-gray-700 purple:text-gray-400">
              <tr>
              {navigation.map((item) => (
                  <th scope="col" class="py-3 px-6">
                      {item}
                  </th>
                  
              ))}
              <th scope="col" class="py-3 px-6">
                  Action
              </th>
              </tr>
          </thead>
          <tbody>
            {
              Sessions.map((item) => (
                  <tr class="bg-white border-b purple:bg-gray-800 purple:border-gray-700">
                      <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap purple:text-white">
                          {item.id}
                      </th>
                      <td class="py-4 px-6">
                          {item.name}
                      </td>
                      {/* <td class="py-4 px-6">
                          {item.participants.map((mop) => (
                            <p>{mop.name}</p>
                          ))}
                      </td> */}
                      <td class="py-4 px-6">
                        <p>{item.nbVolumeMax}</p>
                      </td>
                      <td class="py-4 px-6">
                          <div className="flex justify-content-center">
                            <button onClick={() => modify(item)} type="button" class="mx-2 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center purple:border-blue-500 purple:text-blue-500 purple:hover:text-white purple:focus:ring-blue-800">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>

                              <span class="sr-only">Modifier</span>
                            </button>

                            <button onClick={() => deletePopUp(item.id)} type="button" class="mx-2 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center purple:border-blue-500 purple:text-blue-500 purple:hover:text-white purple:focus:ring-blue-800">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span class="sr-only">Delete</span>
                            </button>

                          {/* <button type="button" class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center purple:border-blue-500 purple:text-blue-500 purple:hover:text-white purple:focus:ring-blue-800">
                              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                              <span class="sr-only">Icon description</span>
                          </button> */}
                          </div>
                      </td>
                  </tr>
              ))
            }
            {
              Sessions.length === 0 ? "Aucune sessions créées" : ''
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
