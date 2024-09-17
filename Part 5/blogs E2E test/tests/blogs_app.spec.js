const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')

    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'root',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    //const locator = await page.getByText('Blogs')
    //await expect(locator).toBeVisible()

    // Check for the presence of the login form elements
    await expect(page.getByRole('button', { name: 'log in' })).toBeVisible()
    await page.getByRole('button', { name: 'log in' }).click()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })


  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'root', 'salainen')
        await expect(page.getByText('Matti Luukkainen logged-in')).toBeVisible()

    })

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'root', 'wrong')
    
        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('Wrong credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    
        await expect(page.getByText('Matti Luukkainen logged-in')).not.toBeVisible() 
    })
  })


  describe('When logged in', () => {
    //Осуществляем вход в приложение перед каждым тестом
    beforeEach(async ({ page }) => {
      // Выполняем вход в систему
      await loginWith(page, 'root', 'salainen')

      // Убеждаемся, что вход выполнен успешно
      await expect(page.getByText('Matti Luukkainen logged-in')).toBeVisible()
    })

    test('A new blog can be created', async ({ page }) => {
      await createBlog(page, 'blog for testing create blog', 'test author', 'https://testblog.com' )

      // Проверяем, что блог отображается в списке
      await expect(page.locator('.blogStyle').getByText(/blog for testing create blog/)).toBeVisible()
      await expect(page.locator('.blogStyle').getByText(/test author/)).toBeVisible()
    })

    test('User can like a blog', async ({ page }) => {
    await createBlog(page, 'blog for testing like', 'test author', 'https://testblog.com' )
    // Раскрываем детали блога
    await page.getByText('blog for testing like test author')
      .locator('..')
      .getByRole('button', { name: 'view' })
      .click();

    // Проверяем начальное количество лайков
    const likesElement = page.getByText('likes 0');
    await expect(likesElement).toBeVisible();

    // Нажимаем кнопку "like"
    await page.getByRole('button', { name: 'like' }).click();

    // Проверяем, что количество лайков увеличилось на 1
    const updatedLikesElement = page.getByText('likes 1');
    await expect(updatedLikesElement).toBeVisible();
    })

    test('User can delete their own blog', async ({ page }) => {
        await createBlog(page, 'blog for testing remoove', 'test author', 'https://testblog.com' )
        // Раскрываем детали блога
        await page.getByText('blog for testing remoove test author')
          .locator('..')
          .getByRole('button', { name: 'view' })
          .click();
    
        // Убеждаемся, что кнопка "remove" видна
        const removeButton = page.getByRole('button', { name: 'remove' });
        await expect(removeButton).toBeVisible();
    
        // Перехватываем окно подтверждения и принимаем его
        page.once('dialog', async dialog => {
          expect(dialog.type()).toBe('confirm');
          expect(dialog.message()).toBe(`Remove blog blog for testing remoove by test author?`);
          await dialog.accept();
        });
    
        // Нажимаем кнопку "remove"
        await removeButton.click();
    
        // Проверяем, что блог больше не отображается в списке
        await expect(page.getByText('blog for testing remoove test author')).not.toBeVisible();
      });
  }) 

})