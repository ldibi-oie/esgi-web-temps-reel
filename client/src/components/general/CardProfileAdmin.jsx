import React from 'react'
import { Link } from 'react-router-dom'
import { addFriend , auth} from '../../firebase/functions'
export default function CardProfileAdmin({infos }) {
    

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md purple:bg-gray-800 purple:border-gray-700 m-3">
        <Link
         to={infos.url}>
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
                <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1024px-Default_pfp.svg.png" alt="Bonnie image"/>
                <h5 className="mb-1 text-xl font-medium text-gray-900 purple:text-white">{infos.name}</h5>
                <span className="text-sm text-gray-500 purple:text-gray-400">{infos.roles}</span>
                <div className="flex mt-4 space-x-3 md:mt-6">
                    <Link to={infos.url} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 purple:bg-blue-600 purple:hover:bg-blue-700 purple:focus:ring-blue-800">{infos.buttonName}</Link>
                </div>
            </div>
        </Link>
    </div>
  )
}
