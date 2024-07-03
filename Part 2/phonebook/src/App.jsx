import { useState, useEffect } from 'react'
import personService from './services/persons'


const DisplayName = ({id, name, number, setPersons}) => {
  const delPerson = () => {
    if (window.confirm(`Delete ${name}?`)) {
    personService.deletePerson(id)
    }
  }

  return (
    <div>
      {name} {number} <Button handleClick={delPerson} text='delete'/>
    </div>
  )
}


const DisplayAll = ({setPersons, persons, filter}) => {
  const filtredPersons = persons.filter((person) => person.name.toLowerCase().includes(filter))
  return (
    filtredPersons.map(person =>
    <DisplayName key={person.id} id={person.id} name={person.name} number={person.number} setPersons={setPersons} />
  )
)
}


const HeaderH1 = (props) => {
  return (
    <div>
      <h1> {props.text} </h1>
    </div>
  )
}


const HeaderH2 = (props) => {
  return (
    <div>
      <h2> {props.text} </h2>
    </div>
  )
}


const Button = ({handleClick, type, text}) => {
  return (
    <button onClick={handleClick} type={type}>{text}</button>
  )
}


const PersonForm = ({addPerson, newName, handlePersonChange, newNumber, handleNumberChange}) => {
  return (
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
      <Button type='Submit' text='add' />
    </div>
  </form>
  )
}


const FilterForm = ({filterName, handleFilterName}) => {
  return (
    <form>
      <div>
        filter shown with <input 
          value={filterName}
          onChange={handleFilterName}
        />
      </div>
    </form>
  )
}


const App = () => {
  // Define states
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

 const hook = () => {
    personService.getAll().then(response => {
      setPersons(response.data)
    })
  }

  useEffect(hook, [])

  // Define functions
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

    personService.create(personObject).then(response => {
      setPersons(persons.concat(response.data))
      setNewName('')
      setNewNumber('')
      })
    }
  }


  // Define handlers
  const handlePersonChange = (event) => {
    console.log('name target value', event.target.value);
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log('number target value', event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterName = (event) => {
    console.log('filter target value', event.target.value)
    setFilterName(event.target.value)
  }

  return (
    <div>
      <HeaderH1 text='Phonebook' />
      <FilterForm
      filterName={filterName}
      handleFilterName={handleFilterName}
      />
      <HeaderH2 text='add a new' />
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <HeaderH1 text='Numbers' />
      <DisplayAll setPersons={setPersons} persons={persons} filter={filterName} />
    </div>
  )
}

export default App