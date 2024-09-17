const { test, expect, beforeEach, afterEach, describe } = require('@playwright/test')
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
      await expect(page.getByText('Matti Luukkainen logged-in')).toBeVisible({ timeout: 10000 })
    })

    afterEach(async ({ page }) => {
        // Выходим из системы, если пользователь всё ещё залогинен
        await page.evaluate(() => {
          localStorage.removeItem('loggedBlogUser')
        })
      })

    test('A new blog can be created', async ({ page }) => {
      await createBlog(page, 'blog for testing create blog', 'test author', 'https://testblog.com' )

      // Проверяем, что блог отображается в списке
      await expect(page.locator('.blogStyle').getByText(/blog for testing create blog/)).toBeVisible({ timeout: 40000 })
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
      
    test('Only the user who created the blog sees the delete button', async ({ page, request }) => {
          // Создание второго пользователя
          const anotherUser = {
            username: 'anotheruser',
            name: 'Another User',
            password: 'password456',
          };
          await request.post('/api/users', { data: anotherUser });

          // создаем блог
          await createBlog(page, 'blog for testing remove button not visible by another user', 'test author', 'https://testblog.com' )
      
          // Выходим из текущего пользователя
          await page.getByRole('button', { name: 'log out' }).click();
      
          // Входим под вторым пользователем
          await loginWith(page, anotherUser.username, anotherUser.password)
      
          // Убеждаемся, что вход выполнен успешно
          await expect(page.getByText(`${anotherUser.name} logged-in`)).toBeVisible();
      
          // Раскрываем детали блога
          await page.getByText('blog for testing remove button not visible by another user test author')
            .locator('..')
            .getByRole('button', { name: 'view' })
            .click();
      
          // Убеждаемся, что кнопка "remove" не отображается
          const removeButton = page.locator('button', { hasText: 'remove' });
          await expect(removeButton).toHaveCount(0);
      
          // Выходим из системы
          await page.getByRole('button', { name: 'log out' }).click();
      
          // Входим обратно под первым пользователем
          await loginWith(page, 'root', 'salainen')
      
          // Убеждаемся, что вход выполнен успешно
          await expect(page.getByText(`Matti Luukkainen logged-in`)).toBeVisible();
      
          // Раскрываем детали блога
          await page.getByText('blog for testing remove button not visible by another user test author')
            .locator('..')
            .getByRole('button', { name: 'view' })
            .click();
      
          // Убеждаемся, что кнопка "remove" отображается
          const removeButtonAfterLogin = page.getByRole('button', { name: 'remove' });
          await expect(removeButtonAfterLogin).toBeVisible();
        });
        
    test('Blogs are ordered by likes in descending order', async ({ page }) => {
    // Создание трёх блогов
    const blogs = [
        { title: 'First Blog', author: 'Author One', url: 'http://first.com' },
        { title: 'Second Blog', author: 'Author Two', url: 'http://second.com' },
        { title: 'Third Blog', author: 'Author Three', url: 'http://third.com' },
    ];

    for (const blog of blogs) {
        await createBlog(page, blog.title, blog.author, blog.url)
        // Ждём, пока блог появится в списке
        await expect(page.getByText(`${blog.title} ${blog.author}`)).toBeVisible();
    }

    // Лайкаем блоги разное количество раз
    const likeCounts = {
        'First Blog': 2,  // 2 лайка
        'Second Blog': 5, // 5 лайков
        'Third Blog': 3,  // 3 лайка
    };

    for (const [title, likes] of Object.entries(likeCounts)) {
        // Находим элемент блога
        const blogElement = page.locator('.blogStyle', { hasText: title });
    
        // Раскрываем детали блога
        await blogElement.getByRole('button', { name: 'view' }).click();
    
        const likeButton = blogElement.getByRole('button', { name: 'like' });
        const likesCountElement = blogElement.getByText(/likes \d+/);
    
        for (let i = 0; i < likes; i++) {
          await likeButton.click();
          // Ждём обновления количества лайков
          await expect(likesCountElement).toHaveText(`likes ${i + 1}`);
        }
    
        // Скрываем детали блога, снова нажав кнопку 'view'
        await blogElement.getByRole('button', { name: 'view' }).click();
      }

    // Обновляем список блогов
    // await page.reload();

    // Проверяем порядок блогов
    const blogElements = await page.$$('.blogStyle');
    console.log('blogElements', blogElements)
    const expectedOrder = ['Second Blog', 'Third Blog', 'First Blog'];

    for (let i = 0; i < expectedOrder.length; i++) {
        const blogElement = blogElements[i];
        console.log('blogElement', blogElement)
        const blogText = await blogElement.textContent();

        expect(blogText).toContain(expectedOrder[i]);
    }
    });
});

})