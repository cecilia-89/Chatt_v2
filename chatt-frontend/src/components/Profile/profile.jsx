const defaultPic = '../../src/images/profile (1).png';
import { useSelector, useDispatch} from 'react-redux';
import { useEffect, useRef} from 'react';
import { getUser, profileDisplay} from '../../actions/index';
import './profile.scss'

const Profile = () => {
    const rootProfile = useRef()
    const user = useSelector(state => state.getUser)
    const profile = useSelector(state => state.profileDisplay)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUser())
    }, [])

    useEffect(() => {
        
        if (profile) {
            rootProfile.current.style.display = 'none'
        } else {
            rootProfile.current.style.display = 'grid'
        }

    }, [profile])

    return (
        <div ref={rootProfile} className="profile-wrapper">
        <div>
            <div className="header">
                <div className="header-text" >Profile</div>
                <div className="exit" onClick={() => {dispatch(profileDisplay())}}>
                    <ion-icon name="close-outline"></ion-icon>
                </div>
            </div>

            <div>
                <div className="image"><img src={defaultPic} alt="" /></div>
                <span>{'@' + user.username}</span>
                <span>{user.quote}</span>
                <span>{user.email}</span>
            </div>

            <div>
                <p>{'\u2728'} <span>Update username</span></p>
                <p>{'\u2728'} <span>Update email</span></p>
                <p>{'\u2728'} <span>Update password</span></p>
                <p>{'\u2728'} <span>Update status quote</span></p>
            </div>
        </div>
    </div>
     );
}

export default Profile;