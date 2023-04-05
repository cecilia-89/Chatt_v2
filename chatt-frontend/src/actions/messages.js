import axios from '../axios'
import cookies from '../cookies'

const cookie = cookies.get('X-Token')

const userMessages = (id) => async dispatch => {

    const response = await axios.get(`/messages/${id}/all`, {
        headers: {
            'X-Token': cookie
        }
    })

    dispatch ({
        type: 'USER_MESSAGES',
        payload: response.data
    })

}

export { userMessages }