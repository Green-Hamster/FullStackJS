import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'


const getAll = () => {
   return axios.get(baseUrl)
}


const create = (personObject) => {
    return axios.post(baseUrl, personObject)
}


const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}


const changeNumber = (personObject) => {
   return axios.put(`${baseUrl}/${personObject.id}`, personObject)
}


export default {
    getAll: getAll,
    create: create,
    deletePerson: deletePerson,
    changeNumber: changeNumber
}