const Part = (props) => {
    return (
      <div>
      <p>{props.name} {props.exercises}</p>
      </div>
    )
  }


const HeaderH2 = (props) => {
    return (
      <div>
        <h2> {props.course} </h2>
      </div>
    )
  }


const Total = ({parts}) => {
    const totalExercize = parts.reduce(
      (accumulator, currentParts) => accumulator + currentParts.exercises, 0
    )
    return (
      <div>
        <p>Total of {totalExercize} exercises</p>
      </div>
    )
  };


const Course = ({course}) => {
    return (
      <div>
        <HeaderH2 course={course.name} />
        {course.parts.map(part =>
          <Part key={part.id} name={part.name} exercises={part.exercises}/>
        )}
        <Total parts={course.parts} />
      </div>
    )
  }

export default Course;


