import Axios from 'axios';

const axios = Axios.create({
    baseURL: "http://localhost:9000/api/v1"
    // import.meta.env.VITE_BASE_URL
    // baseURL: 'https://chatt.cyclic.app/api/v1'
})

export default axios;