const Header = (props) => {
  console.log('header props: ', props)
  return (
    <div>
      <h1> {props.course} </h1>
    </div>
  )
}

const Part = (props) => {
  console.log('Part props: ', props)
  return (
    <p>{props.name} <br/> Exercises: {props.exercises} </p>
  )
}

const Content = (props) => {
  console.log('Content props: ', props)
  return (
    <div>
      <Part name={props.parts[0].name} exercises={props.parts[0].exercises}/>
      <Part name={props.parts[1].name} exercises={props.parts[1].exercises}/>
      <Part name={props.parts[2].name} exercises={props.parts[2].exercises}/>
    </div>
  )
}

const Total = (props) => {
  console.log('Total props: ', props)
  return (
    <div>
      <p>Total exercises: {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
    </div>
  )
}

const App = () => {
  // const-definitions
  const course = 'Half Stack application development'
  const parts = [
  {
    name: 'Fundamentals of React',
    exercises: 10
  },
  {
    name: 'Using props to pass data',
    exercises: 7
  },
  {
    name: 'State of a component',
    exercises: 14
  }
]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default App