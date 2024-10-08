import Course from './components/Course.jsx'

const HeaderH1 = (props) => {
  console.log('header props: ', props)
  return (
    <div>
      <h1> {props.course} </h1>
    </div>
  )
}


const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]


  return (
  <div>
    <HeaderH1 course='Web development cirriculum' />
    {
      courses.map(course =>
      <Course key={course.id} course={course} />
    )}
  </div>
  )
}

export default App
