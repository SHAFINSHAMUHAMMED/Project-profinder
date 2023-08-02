import axios from 'axios'
import { professionalsAPI } from '../Constants/api'

const professionalsInstance= axios.create({
    baseURL: professionalsAPI,
})
export default professionalsInstance