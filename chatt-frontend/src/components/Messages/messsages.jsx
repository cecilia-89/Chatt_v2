import './messages.scss';
import axios from '../../axios'
import cookies from '../../cookies'
import { v4 } from 'uuid';
import { useState, useRef, useEffect, useCallback } from 'react'
import { useSelector, useDispatch} from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { Display, mediaQuery } from '../../actions/index';


const Messages = ({ messages, user, other, otherUser, setContainers, setState, setSearchInput, socket, setMessages}) => {

    const [input, setInput] = useState('')
    const scrollbar = useRef(null);
    const message = useRef()
    const lastMessage = useRef(null);
    const setRef = useCallback(node => {
        if (node) { node.scrollIntoView({ smooth: true }); }
    })
    const cookie = cookies.get('X-Token')

    const messageDisplay = useSelector(state => state.setDisplay);
    const isMobile = useMediaQuery({query: `(max-width: 760px)`});
    const dispatch = useDispatch()


    // responsive based on media width
    useEffect(() => {

        if (!isMobile || (isMobile && !messageDisplay)) {
            message.current.style.display = 'block';

        } else if (isMobile && messageDisplay) {
            message.current.style.display = 'none';
        }

    }, [messageDisplay, isMobile])



    const sendMessage = async (e) => {
        e.preventDefault()

        const data =  {
            message: input,
            containerId: other.id,
            receiverId: other.otherId,
            senderId: user.id,
            type: "text",
            dummyId: v4()
        }
        setMessages((messages) => [...messages, data])
        setInput("")
        setSearchInput("");


        await axios.post('/messages/new', data, {
            headers: {
                'X-Token': cookie
             }
        })
        setState(true);

        // axios.get("containers/all", {
        //     headers: {
        //         'X-Token': cookie
        //     }
        // }).then((response) => {

        // setContainers(response.data)
        // })
    }

    useEffect(() => {
        if (lastMessage.current !== null) {
            lastMessage.current.scrollIntoView({ smooth: true });
        }
    }, [messages]);

    const displayMessage = () => {
        if (messages.length === 0 && otherUser === null) {
            return (
            <div ref={scrollbar} className="empty">
                <div>
                    <img src="../../src/images/undraw_modern_life_re_8pdp.svg" alt="" />
                </div>
                <div>
                    <p>Chatt Instant Messaging</p>
                    <p>Send instant messages to friends and loved ones to keep in touch with another</p>
                </div>
            </div>)
        }

        return (
            <>
            <div className="user-nav">
                {window.matchMedia('(max-width: 768px)').matches ? <span onClick={() => dispatch(Display())}><ion-icon name="arrow-back-outline"></ion-icon></span> : null}
                <div><img src="../../src/images/profile (1).png" alt="" /></div>
                <div>
                    <p>{other.name}</p>
                    <p>Last reply at {other.lastSeen}</p>
                </div>
                <div>
                    <ion-icon name="call"></ion-icon>
                </div>
            </div>

            <div ref={scrollbar} className='messages'>
                {messages.map((message, index) => {
                    const LastMssage = messages.length - 1 === index;
                    if (Object.keys(message).length !== 0 && user !== undefined) {
                        return (
                            <div key={index} ref={LastMssage ? lastMessage: null}
                                className={message.receiverId !==  user.id ? 'current-user-wrapper': 'other-user-wrapper'}>
                                <div className='time-stamp'>{message.timestamp ? message.timestamp.time : 'sending'}</div>
                                <div>{message.message}</div>
                            </div>
                        )
                    }
                })}
            </div>

                <div className="search-bar">
                <form onSubmit={sendMessage}>
                    <div className="icons">
                        <ion-icon name="happy-outline"></ion-icon>
                        <ion-icon name="attach-sharp"></ion-icon>
                    </div>

                    <input value={input}
                           onChange={(e) => setInput(e.target.value)}
                           type="search" name="" id=""
                           placeholder='Send a Message'/>

                    <button onClick={sendMessage} type="button">
                        <ion-icon name="paper-plane"></ion-icon>
                    </button>
                </form>
                </div>
                </>
            )
        }



    return (
        <section ref={message} className='messages-wrapper'>

            {displayMessage()}

        </section>
        );
};

export default Messages;