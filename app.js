//selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);

//Functions

//this event being passed here refers to the event that is associated with this method with the event listeners specified above
function addTodo(event) {
  if (todoInput.value != "") {
    //with this function, we are essentially, creating a div with all the necessary elements for each of our specific todo's

    //prevent form from submitting and causing page refreshes
    event.preventDefault();

    //creating the todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    //creating the li
    const newTodo = document.createElement("li");
    newTodo.classList.add("todo-item");
    newTodo.innerText = todoInput.value;
    todoDiv.appendChild(newTodo);

    //adding ToDo to local storage
    saveLocalToDos(todoInput.value);

    //check mark button
    //inner HTML edits the HTML code while inner text simply just adds text
    const completedButton = document.createElement("button");
    completedButton.innerHTML =
      '<i class="fa-solid fa-square-check fa-lg"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    //delete button
    const trashButton = document.createElement("button");
    trashButton.innerHTML =
      '<i class="fa-sharp fa-solid fa-trash-can fa-lg"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    //appending entire div to the todolist ul
    todoList.appendChild(todoDiv);

    //clearing the input value of the ToDo
    todoInput.value = "";
  } else {
    alert("Please an a task to be added to the list below.");
  }
}

function deleteCheck(event) {
  //grabbing our item from the event
  const item = event.target;

  //in JS triple equals confirms equality
  //an array is returned for the classes of the object, so we want the first element
  if (item.classList[0] === "trash-btn") {
    //removing the parent element of the item rather than the item itself
    const todo = item.parentElement;
    todo.classList.add("fall");

    //removing the todo from local storage
    removeLocalToDos(todo);

    //special event listener to allow both the animation and transition to complete before removing the element in question
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  //for the check-mark, we are adding an unique class, so that a specific set of actions occur when the check is clicked versus the trash button
  if (item.classList[0] === "complete-btn") {
    //toggling classList
    const todo = item.parentElement;
    todo.classList.toggle("completed");
  }
}

//here we are creating a function to filter out out Todos by their current status
function filterTodo(e) {
  //below is includes an node list of all the list elements within the larger unordered list
  const todos = todoList.childNodes;
  //here we are looping through the entire list of todo list elements inside the unordered list and are matching the select option values to the class (i.e. completed with completed)
  //we toggle the display off and on depending upon the provided select option
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

//ensuring that ToDos will save to Local Storage
//since JS doesn't have types for parameters, this todo is simply going to be the input value from our form that will be passed to this function from above where it will be called
function saveLocalToDos(todo) {
  //checking the local storage for any items that may be present
  let todos;
  if (localStorage.getItem("todos") === null) {
    //we create an array if there are no items in the local storage
    todos = [];
  } else {
    //if the local storage isn't empty, then we simply grab the todos item that is present
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

//this method retrieves the data from the local storage and then uses our previous method for creating ToDos, to create new ToDos, based on what was stored to the storage
function getTodos() {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.forEach(function (todo) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const newTodo = document.createElement("li");
    newTodo.classList.add("todo-item");
    newTodo.innerText = todo;
    todoDiv.appendChild(newTodo);

    const completedButton = document.createElement("button");
    completedButton.innerHTML =
      '<i class="fa-solid fa-square-check fa-lg"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML =
      '<i class="fa-sharp fa-solid fa-trash-can fa-lg"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);
  });
}

function removeLocalToDos(todo) {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  //we essentially want to find the index of a specific element from our array, and then we want to remove that element

  //todo here is the div and we are trying to access the text of the div to find the index in the local storage
  const stringitem = todo.children[0].innerText;
  let index;

  for (let i = 0; i < todos.length; i++) {
    if (todos[i] == stringitem) {
      index = i;
      break;
    }
  }

  //splice method is used to remove specific items
  //first argument is the index of what we want to remove, and the second argument is how many we want to remove
  todos.splice(index, 1);

  //updating local storage with new updated array
  localStorage.setItem("todos", JSON.stringify(todos));
}
