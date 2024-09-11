import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Footer from './components/Footer'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login' 
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [message, setMessage] = useState(null)
  const [classMessage, setClassMessage] = useState(null)


  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      console.log('user', user)
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setClassMessage('success')
      setMessage('Great! You are logged in App!')
      setTimeout(() => {
        setClassMessage(null)
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setClassMessage('error')
      setMessage('Wrong credentials')
      setTimeout(() => {
        setClassMessage(null)
        setMessage(null)
      }, 5000)
    }
    console.log('logging in with', username, password)
  }


  const loginForm = () => (
    <Togglable buttonLabel='log in'>
    <LoginForm
    username={username}
    password={password}
    handleUsernameChange={({ target }) => setUsername(target.value)}
    handlePasswordChange={({ target }) => setPassword(target.value)}
    handleSubmit={handleLogin}
  />
  </Togglable>
  )


  const addBlog = (blogObject) => {
  
    try {
    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setClassMessage('success')
        setMessage(`a new Blog ${blogObject.title} by ${blogObject.author} added`)
        setTimeout(() => {
          setClassMessage(null)
          setMessage(null)
        }, 5000)
      })
    } catch (exception) {
      setClassMessage('error')
      setMessage(exception)
      setTimeout(() => {
        setClassMessage(null)
        setMessage(null)
      }, 5000)
    }
  }
  
  


const addBlogForm = () => (
  <BlogForm createBlog={addBlog}/>
)


const logOut = () => {
  window.localStorage.removeItem('loggedBlogUser')
  setUser(null)
  setClassMessage('success')
  setMessage('You are log out from App!')
  setTimeout(() => {
    setClassMessage(null)
    setMessage(null)
  }, 5000)
}

  
  return (
    <div>
      <h2>Log in to Application</h2>
      <Notification className={classMessage} message={message} />
      {user === null ?
      loginForm() :
      <div>
      <h2>Blogs</h2>
      <p>{user.name} logged-in</p>
      <button onClick={logOut}>log out</button>
      {addBlogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
    }
      <Footer />
    </div>
  )
}

export default App