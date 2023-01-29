import { Fragment , useEffect , useState} from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import {logout , auth} from "../../firebase/functions"
import { useAuthState } from 'react-firebase-hooks/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';

const userT = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  }
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function NavBar({ user , isAdmin,  isDisplay , socket }) {
    console.log(isAdmin)
    const navigation = isAdmin === "ADMIN_ROLES" ? [
        { name: 'Dashboard', href: '/home', current: true },
        // { name: 'Team', href: '#', current: false },
        // { name: 'Projects', href: '#', current: false },
        // { name: 'Calendar', href: '#', current: false },
        { name: 'Admin', href: '/admin', current: false },
        { name: 'Mes messages', href: '/messenger', current: false },
        { name: 'Deconnexion', href: '/', current: false  , action: logout},
      ] : [
        { name: 'Dashboard', href: '/home', current: true },
        // { name: 'Team', href: '#', current: false },
        // { name: 'Projects', href: '#', current: false },
        // { name: 'Calendar', href: '#', current: false },
        // { name: 'Admin', href: '/admin', current: false },
        { name: 'Mes messages', href: '/messenger', current: false },
        { name: 'Deconnexion', href: '/', current: false  , action: logout},
      ]
      const userNavigation = [
        { message: 'Your Profile', href: '/messenger' },
        // { name: 'Settings', href: '#' },
        // { name: 'Sign out', href: '#' },
      ]
  
      
    const [dataUser, setDataUser] = useState([]);
    const [userAuth, loading, error] = useAuthState(auth);
    const [MyNotifs, setNotifs] = useState([]);


    useEffect(() => {
        socket.on('getNotification' , (notifs) => setNotifs(notifs))
    })
    useEffect(() => {
        setDataUser(user)
        // console.log(dataUser)
      } , [user , auth])

    return (
        <div className="min-h-full" style={{ display: isDisplay === true ? '' : 'none'}}>
            <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                        
                        </div>
                        <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navigation.map((item) => (
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
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                        <button
                            type="button"
                            className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            <span className="sr-only">View notifications</span>
                        </button>

                        
                        <span className=" text-white">{dataUser === null ? '' : "Bonjour, " + dataUser.email}</span>
                        <img className="h-8 w-8 rounded-full mx-2" src={dataUser === null ? userT.imageUrl : dataUser.photoURL} alt="" />
                        
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                            <div>
                            <Menu.Button className="flex max-w-xs items-center text-white white rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <div className="relative flex items-center p-3 border-b border-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="text-white white w-5" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
                                    </svg>
                                    <span className="block ml-2 font-bold text-gray-600"></span>
                                    {
                                        MyNotifs.length === 0 ? '' : (
                                            <span className="absolute w-4 h-4 bg-red-600 rounded-full left-10 top-3 flex row justify-center items-center"><p>{MyNotifs.length}</p></span>
                                        )
                                    }
                                </div>
                                {/* <span className='text-white'> {user.displayName ? user.displayName : ''} </span> */}
                            </Menu.Button>
                            </div>
                            <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                            >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                    {({ active }) => (
                                    <a
                                        href={item.href}
                                        className={classNames(
                                        active ? 'bg-gray-100' : '',
                                        'block px-4 py-2 text-sm text-gray-700'
                                        )}
                                    >
                                        {item.message}
                                    </a>
                                    )}
                                </Menu.Item>
                                ))}
                            </Menu.Items>
                            </Transition>
                        </Menu>
                        </div>
                    </div>
                    
                    </div>
                </div>

                <Disclosure.Panel className="md:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                    {navigation.map((item) => (
                        <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'block px-3 py-2 rounded-md text-base font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                        >
                        {item.name}
                        </Disclosure.Button>
                    ))}
                    </div>
                    <div className="border-t border-gray-700 pt-4 pb-3">
                    <div className="flex items-center px-5">
                        <div className="flex-shrink-0">
                        <span>FEFEEFE</span>
                        <img className="h-10 w-10 rounded-full" src={dataUser === null ? userT.imageUrl : dataUser.photoURL} alt="" />
                        </div>
                        <div className="ml-3">
                        <div className="text-base font-medium leading-none text-white">{userT.name}</div>
                        <div className="text-sm font-medium leading-none text-gray-400">{userT.email}</div>
                        </div>
                        <button
                        type="button"
                        className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                        <span className="sr-only">View notifications</span>
                        </button>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                        {userNavigation.map((item) => (
                        <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                            {item.name}
                        </Disclosure.Button>
                        ))}
                    </div>
                    </div>
                </Disclosure.Panel>
                </>
            )}
            </Disclosure>
        </div>
    )
}
