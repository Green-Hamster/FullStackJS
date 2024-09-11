const lo = require('lodash')


// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.length === 1
      ? blogs[0].likes
      : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max, blogs[0])
}


const mostBlogs = (blogs) => {
  const authorCounts = lo.countBy(blogs, 'author')

  const topAuthor = lo.maxBy(lo.keys(authorCounts), author => authorCounts[author])

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor]
  }

}


const mostLikes = (blogs) => {
  const authorLikes = lo.reduce(blogs, (result, blog) => {
    if (result[blog.author]) {
      result[blogs.author] += blog.likes
    } else {
      result[blog.author] = blog.likes
    }
    return result
  }, {})

  const topAuthor = lo.maxBy(lo.keys(authorLikes), author => authorLikes[author])

  return {
    author: topAuthor,
    likes: authorLikes[topAuthor]
  }

}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}