const todoList = document.getElementById("todoList");
const newTodoInput = document.getElementById("newToDoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
const dueDateInput = document.getElementById("dueDateInput");
const toggleDarkModeBtn = document.getElementById("toggleDarkMode");
const wellDoneMessage = document.getElementById("wellDoneMessage");

// Function to save to-dos to localStorage
function saveTodos() {
    const todos = [];
    todoList.querySelectorAll("li").forEach(item => {
        todos.push({
            text: item.querySelector(".todo-text").textContent,
            completed: item.classList.contains("completed"),
            dueDate: item.getAttribute("data-due-date")
        });
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to load to-dos from localStorage
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem("todos"));
    if (todos) {
        todos.forEach(todo => {
            createTodoItem(todo.text, todo.completed, todo.dueDate);
        });
    }
}

// Function to create a new to-do item
function createTodoItem(text, completed = false, dueDate = "") {
    const newTodoItem = document.createElement("li");
    newTodoItem.setAttribute("data-due-date", dueDate);

    const todoText = document.createElement("span");
    todoText.classList.add("todo-text");
    todoText.innerText = text;

    // Create checkbox for completion
    const checkTodo = document.createElement("input");
    checkTodo.type = "checkbox";
    checkTodo.classList.add("complete-checkbox");

    if (completed) {
        newTodoItem.classList.add("completed");
        checkTodo.checked = true;
    }

    // Event listener for marking as complete
    checkTodo.addEventListener("change", function() {
        if (this.checked) {
            newTodoItem.classList.add("completed");
            showWellDoneMessage();
        } else {
            newTodoItem.classList.remove("completed");
        }
        saveTodos();
    });

    if (dueDate) {
        todoText.innerText += ` (Due: ${dueDate})`;
    }

    const deleteTodoBtn = document.createElement("button");
    deleteTodoBtn.innerText = "X";
    deleteTodoBtn.classList.add("delete-todo-btn");

    // Event listener for the delete button
    deleteTodoBtn.addEventListener("click", function() {
        newTodoItem.remove();
        saveTodos();
    });

    newTodoItem.appendChild(checkTodo);
    newTodoItem.appendChild(todoText);
    newTodoItem.appendChild(deleteTodoBtn);
    todoList.appendChild(newTodoItem);

    saveTodos();
}

// Function to add a new to-do item
function addTodo() {
    const newTodoText = newTodoInput.value.trim();
    const dueDate = dueDateInput.value;

    if (newTodoText.length > 1 && newTodoText.length <= 100) {
        createTodoItem(newTodoText, false, dueDate);
        newTodoInput.value = "";
        dueDateInput.value = "";
    } else {
        alert("Task should be between 2 and 100 characters.");
    }
}

// Show "Well Done!" Message
function showWellDoneMessage() {
    wellDoneMessage.innerText = "Well done!";
    setTimeout(() => {
        wellDoneMessage.innerText = "";  // Clear message after 3 seconds
    }, 3000);
}

// Event listener for the "Add" button
addTodoBtn.addEventListener("click", addTodo);

// Allow "Enter" key to submit the to-do item
newTodoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTodo();
    }
});

// Filter To-Do Items
document.getElementById("filter-all").addEventListener("click", function() {
    Array.from(todoList.children).forEach(item => {
        item.style.display = "";
    });
});

document.getElementById("filter-active").addEventListener("click", function() {
    Array.from(todoList.children).forEach(item => {
        item.style.display = item.classList.contains("completed") ? "none" : "";
    });
});

document.getElementById("filter-completed").addEventListener("click", function() {
    Array.from(todoList.children).forEach(item => {
        item.style.display = item.classList.contains("completed") ? "" : "none";
    });
});

// Dark Mode Toggle
toggleDarkModeBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

// Load todos on page load
window.addEventListener("load", loadTodos);

// Notification Reminders for due dates
function checkForDueDates() {
    const todos = JSON.parse(localStorage.getItem("todos"));
    if (todos) {
        todos.forEach(todo => {
            const dueDate = new Date(todo.dueDate);
            const today = new Date();

            if (dueDate && dueDate.toDateString() === today.toDateString() && !todo.completed) {
                showNotification(`Reminder: Your task "${todo.text}" is due today!`);
            }
        });
    }
}

function showNotification(message) {
    if (Notification.permission === "granted") {
        new Notification(message);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(message);
            }
        });
    }
}

// Check for due dates on page load
window.addEventListener("load", checkForDueDates);
