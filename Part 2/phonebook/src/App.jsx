import { useState } from 'react'

const DisplayName = ({name}) => {
  return (
    <div>
      {name}
    </div>
  )
}

const HeaderH2 = (props) => {
  console.log('header props: ', props)
  return (
    <div>
      <h1> {props.text} </h1>
    </div>
  )
}

const Button =  (props) => {
  return (
    <button type="submit">add</button>
  )
}


const App = () => {
  const [persons, setPersons] = useState([
    { id:1, name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target);
    const checkName = (element) => element.name === newName;
    if (persons.some(checkName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
    const personObject = {
      name: newName,
      id: persons.length + 1
    }
    setPersons(persons.concat(personObject))
    setNewName('')
  }
  }

  const handlePersonChange = (event) => {
    console.log('target value', event.target.value);
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input 
          value={newName} 
          onChange={handlePersonChange}
          />
        </div>
        <div>
          <Button />
        </div>
      </form>
      <HeaderH2 text='Numbers' />
      {
        persons.map(person =>
          <DisplayName key={person.id} name={person.name} />
        )
      }
    </div>
  )
}

export default App