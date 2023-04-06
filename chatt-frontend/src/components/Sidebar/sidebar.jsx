import './sidebar.scss';
import Messages from '../Messages/messsages'
import { Navbar } from '../Navbar/navbar'
import Profile from '../Profile/profile'
import axios from '../../axios'
import cookies from '../../cookies';
import gsap from 'gsap';
import io from 'socket.io-client';
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch} from 'react-redux'
import { Display, getUser} from '../../actions/index';
import { userContainer } from '../../actions/container';
import { useMediaQuery } from 'react-responsive'

const defaultPic = '../../src/images/profile (1).png';
let socket;


const Sidebar = () => {
    // browser cookie
    const cookie = cookies.get('X-Token');
    const Id = cookies.get('chatt_Id');
    const [input, setInput] = useState(null);
    const display = useSelector(state => state.setDisplay)
    const user = useSelector(state => state.getUser)
    const allContainers = useSelector(state => state.userContainer)
    const dispatch = useDispatch();
    const isMobile = useMediaQuery({ query: `(max-width: 768px)` });

    // responsive based on media width
    useEffect(() => {
        dispatch(getUser())
        dispatch(userContainer())

        if (!input) setState(true)

        if (!isMobile || (isMobile && display)) {
            sidebar.current.style.display = 'block';

        } else if (isMobile && !display) {
            sidebar.current.style.display = 'none';
        }

    }, [display, input, isMobile, cookie])


    // socket instance
    useEffect(() => {
        socket = io('http://localhost:9000');
        socket.emit('connected', user.id);
        console.log('connecting')
        return () => socket.disconnect();
    }, []);


    // DOM references
    const chatt = useRef()
    const loader = useRef()
    const details = useRef()
    const loading = useRef(null);
    const sidebar = useRef()
    const searchWrapper = useRef(null)

    const [navState, setNavState] = useState(false)
    const visible = () => setNavState(!navState)
    const navigate = useNavigate();

    // State variables
    const [, set] = useState([])
    const msg = useRef(null);
    const [Msg, setMsg] = useState("");
    const [inputs, setInputs] = useState({});
    const [messages, setMessages] = useState([])
    const [allUsers, setAllUsers] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [members, setMembers] = useState([])
    const [state, setState] = useState(true);
    const [Connected, setUserConnected] = useState(false);
    const [container, setContainer] = useState([]);
    const [updateBtn, setUpdateBtn] = useState("Update");
    const [other, setOther] = useState({"name":"", "status":"", "id" : "", "otherId": "", "lastSeen": ""})

    useEffect(() => {
        // setOther(null)
        gsap.fromTo(loader.current, {display: 'block'}, {display: 'none', duration: 3})
        gsap.fromTo(chatt.current, {opacity: 0}, {opacity: 1, duration: 1, delay: 1.5})
        gsap.fromTo(details.current, {opacity: 0, y: 200}, {opacity: 1, y: 280, duration: 1})
    }, []);

    useEffect(() => {
        socket.on('user connected', (id) => {
            if (user.id === id) {
                setUserConnected(true);
                console.log(true)
            } else console.log(false)
        });

        socket.emit('container', container)
        console.log('user', user)

        return () => socket.off('user connected');
    }, [user, container]);


    // const setContainersOnly = (oldContainers, updatedContainer) => {
    //     const newContainers = oldContainers.filter(container => {
    //         if (container._id !== updatedContainer._id) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     });
    //     return [updatedContainer, ...newContainers];
    // }

    // const setMessagesOnly = (messages, newMessage) => {
    //     const newMessages = messages.filter(message => {
    //         if (message.dummyId !== newMessage.dummyId) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     });
    //     return [...newMessages, newMessage];
    // }

    useEffect(() => {
        socket.on('new message', (message) => {
            console.log('message', message)
                setMessages([...messages, message]);
        });
        console.log('messages', messages)
        return () => socket.off("new message");
    }, [messages]);


    // useEffect(() => {
    //     dispatch(userContainer())
    //     socket.once('container updated', (container) => {
    //         container.members.forEach(memberId => {
    //             if (memberId.toString() === Id.toString()) {
    //                 // alert(container.container._id);
    //                 setContainers((containers) => setContainersOnly(containers, container.container));
    //             }
    //         });
    //     });

    //     return () => socket.off('container updated');
    // }, []);


    const getMessages = (id) => {

        socket.emit('open container', id);
        axios.get(`/messages/${id}/all`, {
            headers: {
                'X-Token': cookie
            }
        }).then((response) => {
            setMessages(response.data);
        });
    }


    const userDisplay = () => {

        if (allContainers.length === 0) {
            return (
            <div className='noUser'>
                <p>You have no recent chats.</p>
                <p>Search for users and start a conversation now</p>
            </div>)
        }

        return (
            allContainers.map((container) => {
                return (<div className="wrap" key={container._id} onClick={() => {dispatch(Display())
                                                                                getMessages(container._id)
                                                                                setContainer(container._id)
                                                                                setOther('')
                                                                                getName(container.membersUsernames.filter(name => name !== user.username));
                                                                                getlastSeen(container.timestamp.time);
                                                                                getId(container._id);
                                                                                get_id(container.members.filter(member => member !== user.id));
                                                                                setMembers(container.members);}}>
                    <div>
                        <img src={defaultPic} alt="" />
                        <div className={'notifications'}>
                            <div>99</div>
                        </div>
                    </div>
                    <div className='details'>

                      <span>{container.membersUsernames.filter(name => name !== user.username)}</span>
                        <p>{container.lastMessage}</p>
                    </div>
                    <div className="timestamp">
                        <span>{container.timestamp.time}</span>
                    </div>
                </div>)
            })
        )
    }

    const getName = (name) => {
        setOther(existingValues => (
            {
            ...existingValues,
            name: name,
        }))
    }

    const getStatus = (status) => {
        setOther(existingValues => ({
            ...existingValues,
            status: status
        }))
    }

    const getlastSeen = (lastSeen) => {
        setOther(existingValues => ({
            ...existingValues,
            lastSeen
        }))
    }

    const getId = (id) => {
        setOther(existingValues => ({
            ...existingValues,
            id:id
        }))
    }

    const get_id = (_id) => {

        if (Array.isArray(_id)) {
            _id = _id[0]
        }

        setOther(existingValues => ({
            ...existingValues,
            otherId:_id
        }))
    }


    const getUsers = () => {
        axios.get('/users/all', {
            headers: {
                'X-API-Key': import.meta.env.VITE_API_KEY
            }
        })
          .then((response) => {
            setAllUsers(response.data);
          })
          .catch((err) => {
            console.log(err);
            setAllUsers(['Opeyemi', 'Oreoluwa', 'Fiyin', 'Ayomide', 'odunayo', 'Ayodele', 'Oluwatobi', 'ola',
               'joy', 'Renee', 'Bolatito', 'Aphrotee', 'Pamilerin', 'Aphrtee', 'Ibrahim', 'Idris', 'olufunmi',
               'binta', 'pelumi', 'Funto', 'funmi', 'benita'
            ]);
          });
    }


    const handleChange = (event) => {
        const query = event.target.value;

        if (!query) {
            setInput(null);
            setState(true)
        } else {
            setInput(query);
            setState(false)
        }
    }

    const handleStatusChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
      }

    const getContainer = (receiverId) => {

        const response = axios.get(`/container/${receiverId}`, {
            headers: {
                'X-Token': cookies.get('X-Token')
            }
        })
        // const containerId = response.data._id;
        // console.log('I am here')

        // socket.emit('open container', containerId)
        // const other = response.data.membersUsernames.filter((name) => name !== user.username);
        // getMessages(containerId, other);
        // getId(containerId);
        // setMembers(response.data.members)

    }


    const matchedUsers = () => {

        const match = allUsers.filter((User) => {
            if (new RegExp(`\^${input}`, 'i').test(User.username)) {
                return true;
            } else {
                return false;
            }
        });
        if (!match.length) {
            return (<div className='noUser' >No Users found</div>)
        } else {

            return match.map((User) => {
                return (
                    <div className='wrap' onClick={() => {dispatch(Display());
                        setOther('')
                        getContainer(User.id);
                        getName(User.username);
                        getStatus(User.quote)
                        get_id(User.id);
                        }} >
                        <div>
                            <img src={defaultPic} alt=""/>
                        </div>
                        <div className='details'>
                            <span>{User.username}</span>
                            <p>{User.quote}</p>
                        </div>
                    </div>
                )
            });
        }
    }

    const updateStatus = (event) => {
        event.preventDefault();
        console.log(Loading);
        if (!Loading) {
          const { quote } = inputs;

          setMsg("");
          if (!quote) {
            applyMessage("Please enter status quote", false)
          }  else {
              setLoading(!Loading);
              setUpdateBtn("Updating...");
              loading.current.style.opacity = 0.6
              loading.current.style.cursor = 'not-allowed';
              const Id = cookies.get('chatt_Id');
              cookies.remove('id');
              axios.put('/users/update-status-quote',
              {
                Id, quote
              },
              {
                method: 'put',
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-Key': import.meta.env.VITE_API_KEY
                }
              })
                .then((value) => {
                  loading.current.style.opacity = 1
                  loading.current.style.cursor = 'default';
                  setUpdateBtn("Update");
                  navigate('/login', { replace: true });
                })
                .catch((err) => {
                  setLoading(false);
                  setUpdateBtn("Update");
                  loading.current.style.opacity = 1
                  loading.current.style.cursor = 'pointer';
                  applyMessage(`${err.response.data['error']}`, false);
                });
          }
        }
      }


    return (
        <>
            <section ref={sidebar} className='sidebar'>
            <Navbar />
            <div className='chats'>
                <div className='menu'>
                    <input type="search" placeholder='Search to start a converstion' value={input || ''} onClick={getUsers} onChange={handleChange} />
                    <ion-icon name="search-outline"></ion-icon>
                </div>

                <div ref={searchWrapper} className={state? 'hidden': 'search-wrapper'}>
                    {matchedUsers()}
                </div>

                <div className={state? 'chats-wrapper' : 'hidden'}>
                    {userDisplay()}
                </div>

            </div>
            </section>

            <Messages other={other} setSearchInput={setInput} messages={messages} setMessages={setMessages}/>
            <div ref={loader} className='loading'>
                <div ref={details}>
                    <p>Chatt Instant Messaging</p>
                    <p ref={chatt}> Keeping in touch with friends, family and onnecting with new people all over the world </p>
                </div>
            </div>
            <Profile/>
        </>
        );
}

export default Sidebar;