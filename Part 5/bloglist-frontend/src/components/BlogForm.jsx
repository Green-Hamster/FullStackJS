import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }


  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }


  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')

  }

  return (
    <form onSubmit={addBlog}>
      title:
      <input
        value={newTitle}
        onChange={handleTitleChange}
        data-testid="title-input"
      />
      <br />
      author:
      <input
        value={newAuthor}
        onChange={handleAuthorChange}
        data-testid="author-input"
      />
      <br />
      url:
      <input
        value={newUrl}
        onChange={handleUrlChange}
        data-testid="url-input"
      />
      <br />
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm