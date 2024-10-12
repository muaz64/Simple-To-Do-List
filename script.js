$(document).ready(function () {
    const $todoList = $("#todoList");
    const $newTodoInput = $("#newToDoInput");
    const $addTodoBtn = $("#addTodoBtn");
    const $dueDateInput = $("#dueDateInput");
    const $toggleDarkModeBtn = $("#toggleDarkMode");
    const $wellDoneMessage = $("#wellDoneMessage");

    // Function to save to-dos to localStorage
    function saveTodos() {
        const todos = [];
        $todoList.find("li").each(function () {
            const $item = $(this);
            todos.push({
                text: $item.find(".todo-text").text(),
                completed: $item.hasClass("completed"),
                dueDate: $item.data("due-date")
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
        const $newTodoItem = $("<li></li>").attr("data-due-date", dueDate);
        const $todoText = $("<span></span>").addClass("todo-text").text(text);
        const $checkTodo = $("<input type='checkbox' class='complete-checkbox'/>");

        if (completed) {
            $newTodoItem.addClass("completed");
            $checkTodo.prop("checked", true);
        }

        // Event listener for marking as complete
        $checkTodo.on("change", function () {
            if (this.checked) {
                $newTodoItem.addClass("completed");
                showWellDoneMessage();
            } else {
                $newTodoItem.removeClass("completed");
            }
            saveTodos();
        });

        // Append due date to text
        if (dueDate) {
            $todoText.append(` (Due: ${dueDate})`);
        }

        // Create delete button
        const $deleteTodoBtn = $("<button></button>").text("X").addClass("delete-todo-btn");

        // Event listener for the delete button
        $deleteTodoBtn.on("click", function () {
            $newTodoItem.remove();
            saveTodos();
        });

        $newTodoItem.append($checkTodo).append($todoText).append($deleteTodoBtn);
        $todoList.append($newTodoItem);
        saveTodos();
    }

    // Function to add a new to-do item
    function addTodo() {
        const newTodoText = $newTodoInput.val().trim();
        const dueDate = $dueDateInput.val();

        if (newTodoText.length > 1 && newTodoText.length <= 100) {
            createTodoItem(newTodoText, false, dueDate);
            $newTodoInput.val("");
            $dueDateInput.val("");
        } else {
            alert("Task should be between 2 and 100 characters.");
        }
    }

    // Show "Well Done!" Message
    function showWellDoneMessage() {
        $wellDoneMessage.text("Well done!").fadeIn(300).delay(2000).fadeOut(300);
    }

    // Event listener for the "Add" button
    $addTodoBtn.on("click", addTodo);

    // Allow "Enter" key to submit the to-do item
    $newTodoInput.on("keypress", function (e) {
        if (e.key === "Enter") {
            addTodo();
        }
    });

    // Filter To-Do Items
    $("#filter-all").on("click", function () {
        $todoList.children().show();
    });

    $("#filter-active").on("click", function () {
        $todoList.children().filter(".completed").hide();
        $todoList.children().not(".completed").show();
    });

    $("#filter-completed").on("click", function () {
        $todoList.children().filter(".completed").show();
        $todoList.children().not(".completed").hide();
    });

    // Dark Mode Toggle
    $toggleDarkModeBtn.on("click", function () {
        $("body").toggleClass("dark-mode");
    });

    // Load todos on page load
    loadTodos();

    // Notification Reminders for due dates
    function checkForDueDates() {
        const todos = JSON.parse(localStorage.getItem("todos"));
        if (todos) {
            const today = new Date().toDateString();
            todos.forEach(todo => {
                const dueDate = new Date(todo.dueDate).toDateString();
                if (dueDate === today && !todo.completed) {
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
    checkForDueDates();
});
