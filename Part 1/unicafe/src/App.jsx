import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticLine = (props) => {
  return (
    <div>
      {props.text}: {props.count}
    </div>
  )
}

const Statistics = (props) => {
  if (props.good == 0 && props.neutral ==0 && props.bad == 0) {
    return (
      <div> No feedback given</div>
    )
  } else {
  return (
  <div>
      <StatisticLine text='good' count={props.good} />
      <StatisticLine text='neutral' count={props.neutral} />
      <StatisticLine text='bad' count={props.bad} />
      <StatisticLine text='Total' count={props.good+props.neutral+props.bad} />
      <StatisticLine text='Average' count={(props.good-props.bad)/(props.good+props.neutral+props.bad)} />
      <StatisticLine text='Positive' count={100/(props.good+props.neutral+props.bad)*props.good} />
  </div>
  )
}
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
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App