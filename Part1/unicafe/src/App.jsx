import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = (props) => {
  // ...
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
      <Header headerValue={statHeader} />
    </div>
  )
}

export default App