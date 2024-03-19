import express from 'express'

const app = express()

let idCounter = 2 //snaha o zabránění duplicitních ID způsobených odebíráním úkolů

let todos = [
  {
    id: 1,
    title: 'Zajít na pivo',
    done: true,
  },
  {
    id: 2,
    title: 'Vrátit se z hospody',
    done: false,
  },
]

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log('Incomming request', req.method, req.url)
  next()
})

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Japierdole',
    todos,
  })
})

//ujocode
app.get('/todo/:id', (req, res) => {
  const todoId = req.params.id;
  const todo = todos.find(todo => todo.id === parseInt(todoId));
  res.render('detail', { todo });
});


app.post('/add-todo', (req, res) => {
  idCounter ++; //zvyšování id počítadla ID, snaha o zabránění duplicitních ID způsobených odebíráním úkolů
  const todo = {
    id: idCounter,
    title: req.body.title,
    done: false,
  }

  todos.push(todo)

  res.redirect('/')
})

app.get('/remove-todo/:id', (req, res) => {
  todos = todos.filter((todo) => {
    return todo.id !== Number(req.params.id)
  })

  res.redirect('/')
})

app.get('/toggle-todo/:id', (req, res) => {
  const todo = todos.find((todo) => {
    return todo.id === Number(req.params.id)
  })

  todo.done = !todo.done

  res.redirect('/')
})


//toggle z detailu, redirect na detail
app.get('/toggle-todo-detail/:id', (req, res) => {
  const todo = todos.find((todo) => {
    return todo.id === Number(req.params.id)
  })

  todo.done = !todo.done

  res.redirect(`/todo/${todo.id}`);
})

//změna titulku z detailu
app.post('/todo/:id/update-title', (req, res) => {
  const todoId = parseInt(req.params.id);
  const newTitle = req.body.newTitle;

  const todo = todos.find(todo => todo.id === todoId);

  if (!todo) {
      return res.status(404).send('Todo not found');
  }

  todo.title = newTitle;

  res.redirect(`/todo/${todoId}`);
});


app.use((req, res) => {
  res.status(404)
  res.send('404 - Page not found')
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500)
  res.send('500 - Server error')
})

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000')
})
