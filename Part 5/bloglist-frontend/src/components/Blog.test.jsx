import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders title and author, but does not render URL or likes by default', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://testurl.com',
    likes: 5
  }

  // Рендерим компонент Blog
  render(<Blog blog={blog} />)

  // Проверяем, что отображаются заголовок и автор
  const titleElement = screen.getByText(/Test Blog Title/i)
  const authorElement = screen.getByText(/Test Author/i)

  expect(titleElement).toBeInTheDocument()
  expect(authorElement).toBeInTheDocument()

  // Проверяем, что URL и количество лайков не отображаются по умолчанию
  const urlElement = screen.queryByText('https://testurl.com')
  const likesElement = screen.queryByText('likes 5')

  expect(urlElement).not.toBeInTheDocument()
  expect(likesElement).not.toBeInTheDocument()
})


test('renders URL and likes when the view button is clicked', async () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://testurl.com',
    likes: 5,
    user: {
      username: 'johndoe',
      name: 'John Doe',
      id: '66d2f682dcc2921c7e30b3dd'
    }
  }

  const blogUser = {
    username: 'johndoe',
    name: 'John Doe',
    id: '66d2f682dcc2921c7e30b3dd'
  }

  // Рендерим компонент Blog
  render(<Blog blog={blog} user={blogUser} />)

  // Проверяем, что по умолчанию отображаются заголовок и автор, но не URL и лайки
  const titleElement = screen.getByText(/Test Blog Title/i)
  const authorElement = screen.getByText(/Test Author/i)
  expect(titleElement).toBeInTheDocument()
  expect(authorElement).toBeInTheDocument()

  const urlElement = screen.queryByText('https://testurl.com')
  const likesElement = screen.queryByText('likes 5')
  expect(urlElement).not.toBeInTheDocument()
  expect(likesElement).not.toBeInTheDocument()

  // Находим и кликаем по кнопке "view" с использованием userEvent
  const button = screen.getByText('view')
  const user = userEvent.setup() // создание экземпляра userEvent
  await user.click(button) // ожидание выполнения события клика

  // После клика проверяем, что URL и количество лайков отображаются
  const displayedUrl = screen.getByText('https://testurl.com')
  const displayedLikes = screen.getByText('likes 5')
  expect(displayedUrl).toBeInTheDocument()
  expect(displayedLikes).toBeInTheDocument()
})


test('calls the like button event handler twice when clicked twice', async () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://testurl.com',
    likes: 5,
    user: {
      username: 'johndoe',
      name: 'John Doe',
      id: '66d2f682dcc2921c7e30b3dd'
    }
  }

  const blogUser = {
    username: 'johndoe',
    name: 'John Doe',
    id: '66d2f682dcc2921c7e30b3dd'
  }

  // Создаём мок-функцию для обработчика события like
  const mockHandler = vi.fn()

  // Рендерим компонент Blog, передавая mock-функцию в качестве обработчика нажатий на кнопку like
  render(<Blog blog={blog} addLike={mockHandler}  user={blogUser} />)

  // Находим и кликаем по кнопке "view" для отображения деталей блога
  const viewButton = screen.getByText('view')
  const user = userEvent.setup()
  await user.click(viewButton)

  // Находим кнопку "like"
  const likeButton = screen.getByText('like')

  // Кликаем по кнопке "like" дважды
  await user.click(likeButton)
  await user.click(likeButton)

  // Проверяем, что mockHandler был вызван дважды
  expect(mockHandler).toHaveBeenCalledTimes(2)
})