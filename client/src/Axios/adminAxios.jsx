import axios from 'axios'
import { adminAPI } from '../Constants/api'

const adminInstance= axios.create({
    baseURL: adminAPI,
})
export default adminInstance