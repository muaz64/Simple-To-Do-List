const todoList = document.getElementById("todoList");
const newTodoInput = document.getElementById("newToDoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
const dueDateInput = document.getElementById("dueDateInput");
const toggleDarkModeBtn = document.getElementById("toggleDarkMode");

// Function to save to-dos to localStorage
function saveTodos() {
    const todos = [];
    todoList.querySelectorAll("li").forEach(item => {
        todos.push({
            text: item.firstChild.textContent,
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
    newTodoItem.innerText = text;

    if (completed) {
        newTodoItem.classList.add("completed");
    }

    if (dueDate) {
        newTodoItem.innerText += ` (Due: ${dueDate})`;
        newTodoItem.setAttribute("data-due-date", dueDate);
    }

    // Event listener for double-click to edit the to-do item
    newTodoItem.addEventListener("dblclick", function() {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = newTodoItem.firstChild.textContent.trim();
        editInput.classList.add("edit-todo-input");

        editInput.addEventListener("blur", function() {
            if (editInput.value.trim() !== "") {
                newTodoItem.innerText = editInput.value.trim();
                newTodoItem.appendChild(deleteTodoBtn);
                newTodoItem.appendChild(completeTodoBtn);
                saveTodos();
            }
        });

        newTodoItem.innerText = "";
        newTodoItem.appendChild(editInput);
        editInput.focus();
    });

    // Mark as completed toggle
    newTodoItem.addEventListener("click", function() {
        newTodoItem.classList.toggle("completed");
        saveTodos();
    });

    const deleteTodoBtn = document.createElement("button");
    deleteTodoBtn.innerText = "X";
    deleteTodoBtn.classList.add("delete-todo-btn");

    // Event listener for the delete button
    deleteTodoBtn.addEventListener("click", function() {
        newTodoItem.remove();
        saveTodos();
    });

    newTodoItem.appendChild(deleteTodoBtn);
    todoList.appendChild(newTodoItem);
    saveTodos();
}

// Function to add a new to-do item
function addTodo() {
    const newTodoText = newTodoInput.value.trim();
    const dueDate = dueDateInput.value;

    if (newTodoText.length > 1 && newTodoText.length <= 100) {
        createTodoItem(`${newTodoText}`, false, dueDate);
        newTodoInput.value = "";
        dueDateInput.value = "";
    } else {
        alert("Task should be between 2 and 100 characters.");
    }
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
