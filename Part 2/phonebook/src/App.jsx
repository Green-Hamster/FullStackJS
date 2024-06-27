import { useState } from 'react'

const DisplayName = ({name, number}) => {
  return (
    <div>
      {name} {number}
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
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target);
    const checkName = (element) => element.name === newName;
    if (persons.some(checkName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }
  }

  const handlePersonChange = (event) => {
    console.log('name target value', event.target.value);
    setNewName(event.target.value)
  }

  
  const handleNumberChange = (event) => {
    console.log('number target value', event.target.value)
    setNewNumber(event.target.value)
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
          number: <input 
          value={newNumber}
          onChange={handleNumberChange}
          />
        </div>
        <div>
          <Button />
        </div>
      </form>
      <HeaderH2 text='Numbers' />
      {
        persons.map(person =>
          <DisplayName key={person.id} name={person.name} number={person.number} />
        )
      }
    </div>
  )
}

export default App