import React , {useEffect , useState} from 'react'
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Link } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Refused() {
    const [waiting , setwaiting] = useState([])
    const [isModal , setIsModal] = useState(false)
    const getUsers = async () => {
        try {
            const waitingCollectionRef = await query(collection (db ,"waiting") , where("status" , "==" , "REFUSED"))
            const data = await getDocs(waitingCollectionRef)
            setwaiting(data.docs.map((doc) => ({...doc.data() , id: doc.id})))
        }catch (err) {
        alert(err.message)
        }
    }
    useEffect(() => {
        // if(!isAdmin) return;
        // getUsers()

        getUsers()
        console.log(waiting)
    } , [] )

    const deletePopUp = () => {
        this.isModal = !this.isModal
    }

    const navigation = [
        "id",
        "De (from)",
        "Pour (to)",
      ]
    
    const navigationHeader = [
      { name: 'Demandes en attente', href: '/admin/waiting/', current: true },
      { name: 'Demandes Acceptées', href: '/admin/waiting/validated', current: true },
      // { name: 'Mes messages', href: '/messenger', current: false },
      // { name: 'Deconnexion', href: '/', current: false  , action: logout},
    ]

  return (
    <div>
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Demandes Refusées</h1>
          </div>
        </header>
        <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigationHeader.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href}
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
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>
        <div class="m-5 overflow-x-auto relative">
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
                    waiting.map((item) => (
                        <tr class="bg-white border-b purple:bg-gray-800 purple:border-gray-700">
                            <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap purple:text-white">
                                {item.id}
                            </th>
                            <td class="py-4 px-6">
                                {item.fromName}
                            </td>
                            <td class="py-4 px-6">
                                {item.toName}
                            </td>
                            <td class="py-4 px-6">
                                <div className="flex justify-content-center">
                                  {/* <button onClick={() => deletePopUp(item.uid)} type="button" class="mx-2 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center purple:border-blue-500 purple:text-blue-500 purple:hover:text-white purple:focus:ring-blue-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    <span class="sr-only">Valider</span>
                                  </button> */}

                                  <button onClick={() => deletePopUp(item.uid)} type="button" class="mx-2 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center purple:border-blue-500 purple:text-blue-500 purple:hover:text-white purple:focus:ring-blue-800">
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
                </tbody>
            </table>
        </div>

        
    </div>
  )
}
