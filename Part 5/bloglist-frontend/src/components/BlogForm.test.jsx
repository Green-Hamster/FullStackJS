import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  it('calls the event handler with correct details when a new blog is created', async () => {
    const createBlog = vi.fn() // создаём мок-функцию

    // Рендерим компонент BlogForm с мок-функцией
    render(<BlogForm createBlog={createBlog} />)

    const user = userEvent.setup()

    // Находим поля ввода и кнопку
    const titleInput = screen.getByTestId('title-input')
    const authorInput = screen.getByTestId('author-input')
    const urlInput = screen.getByTestId('url-input')
    const createButton = screen.getByText('create')

    // Заполняем форму
    await user.type(titleInput, 'Testing the Blog Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'https://testurl.com')

    // Нажимаем кнопку для отправки формы
    await user.click(createButton)

    // Проверяем, что мок-функция была вызвана с правильными аргументами
    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Testing the Blog Title',
      author: 'Test Author',
      url: 'https://testurl.com'
    })
  })
})
