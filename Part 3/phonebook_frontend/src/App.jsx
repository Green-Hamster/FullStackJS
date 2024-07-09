import { useState, useEffect } from 'react'
import personService from './services/persons'
import Button from './components/Button'
import HeaderH1 from './components/HeaderH1'
import HeaderH2 from './components/HeaderH2'
import './index.css'



const DisplayName = ({id, name, number, setPersons, persons}) => {
  const delPerson = (id) => {
    if (window.confirm(`Delete ${name}?`)) {
    personService.deletePerson(id)
    .then(response => {
      setPersons(persons.filter((person) => person.id !== response.data.id))
    })
  }
}
  
  return (
    <div>
      {name} {number} <Button handleClick={() => delPerson(id)} text='delete'/>
    </div>
  )
}


const DisplayAll = ({setPersons, persons, filter}) => {
  const filteredPersons = persons.filter((person) => person.name.toLowerCase().includes(filter))
  return (
    filteredPersons.map(person =>
    <DisplayName key={person.id} id={person.id} name={person.name} number={person.number} setPersons={setPersons} persons={filteredPersons} />
  )
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


const Notification = ({className, message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}


const App = () => {
  // Define states
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [message, setMessage] = useState('')
  const [typeMessage, setTypeMessage] = useState('')

 const hook = () => {
    personService.getAll().then(response => {
      setPersons(response.data)
    })
  }

  useEffect(hook, [])

  // Define functions
  const addPerson = (event) => {
    event.preventDefault()
    const checkPerson = (element) => {
      return element.name === newName && element.number === newNumber

    };
    const checkNumber = (element) => {
      return element.name === newName && element.number != newNumber
    };
    if (persons.some(checkPerson)) {
      alert(`${newName} is already added to phonebook`)
    } else if (persons.some(checkNumber)) {
      const changingPerson = persons.find(item => item.name == newName)
      if (window.confirm(`${changingPerson.name} is already added to phonebook, replace the old number with a new one?`))
      changingPerson.number = newNumber
      personService.changeNumber(changingPerson).catch(error => {
        setMessage(`Information about ${changingPerson.name} has already been removed from server`)
        setTypeMessage('error')
        setTimeout(() => {
          setMessage(null);
          setTypeMessage(null)
        }, 5000)
        
      })
      setNewName('')
      setNewNumber('')
      setMessage(`${changingPerson.name} number replace succesfull!`)
      setTypeMessage('success')
      setTimeout(() => {
        setMessage(null);
        setTypeMessage(null)
      }, 5000)
    } else {
    const personObject = {
      name: newName,
      number: newNumber
    }
    personService.create(personObject).then(response => {
      setPersons(persons.concat(response.data))
      setNewName('')
      setNewNumber('')
      setMessage(`Added ${response.data.name}`)
      setTypeMessage('success')
      setTimeout(() => {
        setMessage(null);
        setTypeMessage(null)
      }, 5000)
      })
      .catch(error => {
        setMessage(error.response.data.error)
        setTypeMessage('error')
      })
    }
  }


  useEffect(hook, [])


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
      <Notification className={typeMessage} message={message} /> 
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