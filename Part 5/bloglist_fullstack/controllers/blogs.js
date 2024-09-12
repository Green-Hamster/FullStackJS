const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  let body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  console.log('savedBlog', savedBlog)
  user.blogs = user.blogs.concat(savedBlog._id)
  console.log('user', user)
  await user.save()

  response.status(201).json(savedBlog)
})


blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log('request.user.toString()', request.user.toString())
  console.log('decodedToken.id.toString()', decodedToken.id.toString())
  if (request.user._id.toString() === decodedToken.id.toString()){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(403).json('Permission denied')
  }
})


blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const user = body.user
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, upsert: false })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).json({ error: 'Blog not found' })
  }
})

module.exports = blogsRouter