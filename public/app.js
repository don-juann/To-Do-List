document.addEventListener('DOMContentLoaded', function () {
    fetchTasks();

    document.getElementById('taskForm').addEventListener('submit', function (event) {
        event.preventDefault();
        addTask();
    });
});

function fetchTasks() {
    fetch('http://localhost:3000/tasks')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return response.json();
        })
        .then(tasks => {
            const tasksContainer = document.getElementById('tasks');
            tasksContainer.innerHTML = ''; 
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('task');
                taskElement.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <button onclick="updateTask('${task._id}')">Update</button>
                    <button onclick="deleteTask('${task._id}')">Delete</button>
                `;
                tasksContainer.appendChild(taskElement);
            });
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}

function addTask() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add task');
        }
        return response.json();
    })
    .then(newTask => {
        fetchTasks(); 
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
    })
    .catch(error => {
        console.error('Error adding task:', error);
    });
}

function updateTask(id) {
    const title = prompt('Enter new title:');
    const description = prompt('Enter new description:');

    fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        fetchTasks(); 
    })
    .catch(error => {
        console.error('Error updating task:', error);
    });
}



function deleteTask(id) {
    fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        fetchTasks(); 
    })
    .catch(error => {
        console.error('Error deleting task:', error);
    });
}
