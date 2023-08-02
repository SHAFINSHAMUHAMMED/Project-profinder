import axios from 'axios'
import { userAPI } from '../Constants/api'

const userInstance= axios.create({
    baseURL: userAPI,
})
export default userInstance