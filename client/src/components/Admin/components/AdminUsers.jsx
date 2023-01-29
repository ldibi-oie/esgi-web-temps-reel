import React , {useEffect , useState} from 'react'
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';

export default function AdminUsers({isAdmin}) {
    const [dataUsers , setdataUsers] = useState([])
    const [isModal , setIsModal] = useState(false)
    const getUsers = async () => {
        try {
            const usersCollectionRef = await query(collection (db ,"users"), where("roles", "not-in", ["ADMIN_ROLES"]))
            const data = await getDocs(usersCollectionRef)
            setdataUsers(data.docs.map((doc) => ({...doc.data() , id: doc.id})))
        }catch (err) {
        alert(err.message)
        }
    }
    useEffect(() => {
        // if(!isAdmin) return;
        // getUsers()

        getUsers()
        console.log(dataUsers , isAdmin)
    } , [] )

    const deletePopUp = () => {
        this.isModal = !this.isModal
    }

    const navigation = [
        "id",
        "auth",
        "email",
        "name",
        "roles",
      ]

  return (
    <div>
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestions des utilisateurs</h1>
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
                        dataUsers.map((item) => (
                            <tr class="bg-white border-b purple:bg-gray-800 purple:border-gray-700">
                                <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap purple:text-white">
                                    {item.id}
                                </th>
                                <td class="py-4 px-6">
                                    {item.authProvider}
                                </td>
                                <td class="py-4 px-6">
                                    {item.email}
                                </td>
                                <td class="py-4 px-6">
                                    {item.name}
                                </td>
                                <td class="py-4 px-6">
                                    {item.roles}
                                </td>
                                <td class="py-4 px-6">
                                    <div className="flex justify-content-center">
                                    <button onClick={() => deletePopUp(item.uid)} type="button" class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center purple:border-blue-500 purple:text-blue-500 purple:hover:text-white purple:focus:ring-blue-800">
                                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
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
