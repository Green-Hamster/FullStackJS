import { useState } from 'react'

const Blog = ({ blog, addLike, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)



  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <button onClick={() => setVisible(!visible)}>view</button>
      {visible ?
        <div>
          {blog.title}
          <p>{blog.url}</p>
          <span>likes {blog.likes}</span>
          <button onClick={() => addLike(blog)}>like</button>
          <p>{blog.author}</p>
          <br />
          {user.username === blog.user.username && (
            <button onClick={() => deleteBlog(blog.id, blog.title, blog.author)}>
              remove
            </button>
          )}
        </div> :
        <div>
          {blog.title} {blog.author}
        </div>
      }
    </div>
  )}

export default Blog