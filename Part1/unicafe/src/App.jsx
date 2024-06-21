import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = (props) => {
  return (
    <div>
      {props.type}: {props.count}
    </div>
  )
}

const Header = (props) => {
  console.log('header props: ', props)
  return (
    <div>
      <h1> {props.headerValue} </h1>
    </div>
  )
}

const App = () => {
  // сохраняем нажатия каждой кнопки в ее собственном состоянии
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const fbHeader = 'give feedback'
  const statHeader = 'statistics'


  return (
    <div>
      <Header headerValue={fbHeader} />
      <Button handleClick={()=>setGood(good+1)} text='good' />
      <Button handleClick={()=>setNeutral(neutral+1)}text='neutral' />
      <Button handleClick={()=>setBad(bad+1)} text='bad' />
      <Header headerValue={statHeader} />
      <Statistics type='good' count={good} />
      <Statistics type='neutral' count={neutral} />
      <Statistics type='bad' count={bad} />
      Total: {good+neutral+bad}<br />
      Average: {(good-bad)/(good+neutral+bad)}<br />
      Positive: {100/(good+neutral+bad)*good}
    </div>
  )
}

export default App