import { useState } from 'react'

const Header = (props) => {
  console.log('header props: ', props)
  return (
    <div>
      <h1> {props.headerValue} </h1>
    </div>
  )
}

const Button = (props) => {
  console.log('selected number');
  return (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const DisplayAnecdote = (props) => {
  return (
    <div>
      {props.text}
      <p>{'Has ' + props.statVotes + ' votes'}</p>
    </div>
  )
}

const saveVote = (selected, votes, setVotes) => {
  console.log('votes in saveVote', votes);
  const newVotes = [...votes]
  newVotes[selected] += 1
  setVotes(newVotes)
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))



  return (
    <div>
      <Header headerValue='Anecdote of the day' />
      <DisplayAnecdote statVotes={votes[selected]} text={anecdotes[selected]} />
      <Button handleClick={()=>setSelected(getRandomInt(anecdotes.length))} text='next anecdote'/>
      <Button handleClick={() => saveVote(selected, votes, setVotes)} text='vote' />
      <Header headerValue='Anecdote with most votes' />
      <DisplayAnecdote statVotes={Math.max.apply(null, votes)} text={anecdotes[votes.indexOf(Math.max.apply(null, votes))]} />
    </div>
  )
}

export default App