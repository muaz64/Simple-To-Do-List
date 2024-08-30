const todoList = document.getElementById("todoList");
const newTodoInput = document.getElementById("newToDoInput");
const addTodoBtn = document.getElementById("addTodoBtn");

// Function to add a new to-do item
function addTodo() {
    const newTodoText = newTodoInput.value.trim();

    // Basic input validation
    if (newTodoText.length > 1 && newTodoText.length <= 100) {
        const newTodoItem = document.createElement("li");
        newTodoItem.innerText = newTodoText;

        const deleteTodoBtn = document.createElement("button");
        deleteTodoBtn.innerText = "X";
        deleteTodoBtn.classList.add("delete-todo-btn");

        // Event listener for the delete button
        deleteTodoBtn.addEventListener("click", function() {
            newTodoItem.remove();
        });

        newTodoItem.appendChild(deleteTodoBtn);
        todoList.appendChild(newTodoItem);

        // Clear the input field
        newTodoInput.value = "";
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
