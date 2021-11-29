const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).send({ message: "User not found" });
  }

  request.todos = user.todos;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const customerAlreadyExists = users.some(
    (user) => user.username === username
  );

  if (customerAlreadyExists) {
    return response.status(404).send({ message: "User already exists" });
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: [],
  });

  return response.status(200).send(users);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { todos } = request;

  return response.status(200).json(todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  request.todos.push(todo);

  return response.status(201).send();
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  // const { username } = request.headers;
  const { id } = request.params;
  const { todos } = request;

  const todo = todos.find((todo) => todo.id === id);

  if (todo) {
    todo.title = title;
    todo.deadline = new Date(deadline);

    return response.status(200).json(todo);
  }
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
