"use strict";

class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}

class Task {
    constructor(id, role, assignedTo) {
        this.id = id;
        this.role = role;
        this.assignedTo = assignedTo;
    }
}

class UserService {
    constructor() {
        this.users = [];
        this.nextId = 1;
    }

    createUser(name, email) {
        const existingUser = this.getByEmail(email);
        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        const user = new User(this.nextId++, name, email);
        this.users.push(user);
        return user;
    }

    getAllUsers() {
        return this.users;
    }

    getById(id) {
        return this.users.find((user) => user.id === id);
    }

    getByEmail(email) {
        return this.users.find((user) => user.email === email);
    }

    updateUser(id, updates) {
        var _a, _b;
        const user = this.getById(id);
        if (!user) return false;
        if (updates.email && updates.email !== user.email) {
            const existingUser = this.getByEmail(updates.email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
        }

        user.name = updates.name ?? user.name;
        user.email = updates.email ?? user.email;
        return true;
    }

    deleteUser(id) {
        const userIndex =  this.users.findIndex((user) => user.id === id);
        if (userIndex !== -1) {
            taskManager.getByUser(id).forEach(task => {
                taskManager.unassignTask(task.id, id);
            });
            this.users.splice(userIndex, 1);
            return true;
        }

        return false;
    }

}

class TaskManager {
    constructor() {
        this.tasks = [];
        this.nextTaskId = 1;
    }

    createTask(role) {
        const task = new Task(this.nextTaskId++, role);
        this.tasks.push(task);
        return task;
    }

    getAllTasks() {
        return this.tasks;
    }

    getById(id) {
        return this.tasks.find((task) => task.id === id) || null;
    }

    updateTask(id, newRole) {
        const task = this.getById(id);
        if (!task)
            return false;
        task.role = newRole;
        return true;
    }

    deleteTask(id) {
        const taskIndex = this.tasks.findIndex((task) => task.id === id);
        return taskIndex !== -1 ? this.tasks.splice(taskIndex, 1) : false;
    }

    assignTask(taskId, userId) {
        const task = this.getById(taskId);
        if (!task) return false;
        task.assignedTo = userId;
        return true;
    }

    unassignTask(taskId, userId) {
        const task = this.getById(taskId);
        if (!task) return false;
        delete task.assignedTo;
        return true;
    }

    getByUser(userId) {
        return this.tasks.filter(task => task.assignedTo === userId);
    }
}

const userService = new UserService();
const taskManager = new TaskManager();


function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function displayUser() {
    const usersList = document.getElementById('users-list');
    const usersCount = document.getElementById('users-count');
    const users = userService.getAllUsers();

    usersCount.textContent = users.length;

    if (users.length === 0) {
        usersList.innerHTML = `
                    <div class="empty-state">                 
                        <p>No users found. Add your first user above!</p>
                    </div>
                `;
        return;
    }

    usersList.innerHTML = users.map(user => `
                <div class="item">
                    <div class="item-header">
                        <div class="item-info">
                            <div class="item-title">${escapeHtml(user.name)}</div>
                            <div class="item-subtitle">${escapeHtml(user.email)}</div>
                            <div class="item-subtitle">ID: ${user.id}</div>
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                         
                            Delete
                        </button>
                    </div>
                </div>
                </div>
            `).join('');
}

function displayTasks() {
    const tasksList = document.getElementById('tasks-list');
    const tasksCount = document.getElementById('tasks-count');
    const tasks = taskManager.getAllTasks();

    tasksCount.textContent = tasks.length;

    if (tasks.length === 0) {
        tasksList.innerHTML = `
                    <div class="empty-state">
                        <p>No tasks found. Add your first task above!</p>
                    </div>
                `;
        return;
    }

    tasksList.innerHTML = tasks.map(task => {
        const assignedUser = task.assignedTo ? userService.getById(task.assignedTo) : null;
        const isAssigned = assignedUser !== null;

        return `
                   <div class="item">
                        <div class="item-header">
                            <div class="item-info">
                                <div class="item-title">${escapeHtml(task.role)}</div>
                                <div class="item-subtitle">ID: ${task.id}</div>
                                ${isAssigned
            ? `<div class="item-subtitle">Assigned to: ${escapeHtml(assignedUser.name)}</div>`
            : `<div class="item-subtitle">Unassigned</div>`}
                                <span class="task-status  ${isAssigned ? 'status-assigned' : 'status-unassigned'}">
                                    ${isAssigned ? 'Assigned' : 'Unassigned'}
                                </span>
                            </div>
                        </div>
                        <div class="item-actions">
                            <button class="btn btn-sm btn-warning" onclick="editTask(${task.id})">                             
                                Edit
                            </button>
                            ${!isAssigned ?
            `<button class="btn btn-sm btn-success" onclick="assignTask(${task.id})">                   
                                    Assign
                                </button>` :
            `<button class="btn btn-sm btn-warning" onclick="unassignTask(${task.id})">                                 
                                    Unassign
                                </button>`
        }
                            <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">
                                Delete
                            </button>
                        </div>
                    </div>
                `;
    }).join('');
}

function populateUserSelect() {
    const select = document.getElementById('assign-user-select');
    const users = userService.getAllUsers();

    select.innerHTML = '<option value="">Choose a user...</option>';
    users.forEach(user => {
        select.innerHTML += `<option value="${user.id}">${escapeHtml(user.name)} (${escapeHtml(user.email)})</option>`;
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.getElementById('user-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim();

    if (!name || !email) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    try {
        userService.createUser(name, email);
        showAlert(`User "${name}" created successfully!`);

        this.reset();
        displayUser();
        populateUserSelect();

    } catch (error) {
        showAlert(error.message, 'error');
    }
});

document.getElementById('task-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const role = document.getElementById('task-role').value.trim();

    if (!role) {
        showAlert('Please enter a task description', 'error');
        return;
    }

    try {
        taskManager.createTask(role);
        showAlert(`Task "${role}" created successfully!`);

        this.reset();
        displayTasks();
    } catch (error) {
        showAlert(error.message, 'error');
    }
});


document.getElementById('edit-task-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('edit-task-id').value);
    const role = document.getElementById('edit-task-role').value.trim();

    // Input validation
    if (!role) {
        showAlert('Please enter a task description', 'error');
        return;
    }

    try {
        const success = taskManager.updateTask(id, role);
        if (success) {
            showAlert(`Task updated successfully!`);
            closeModal('edit-task-modal');
            displayTasks();
        } else {
            showAlert('Task not found', 'error');
        }
    } catch (error) {
        showAlert(error.message, 'error');
    }
});

// assign task to user
document.getElementById('assign-task-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const taskId = parseInt(document.getElementById('assign-task-id').value);
    const userId = parseInt(document.getElementById('assign-user-select').value);

    // Input validation
    if (!userId) {
        showAlert('Please select a user', 'error');
        return;
    }

    try {
        const success = taskManager.assignTask(taskId, userId);
        if (success) {
            const user = userService.getById(userId);
            const task = taskManager.getById(taskId);
            showAlert(`Task "${task.role}" assigned to ${user.name}!`);
            closeModal('assign-task-modal');
            displayTasks();
        } else {
            showAlert('Task not found', 'error');
        }
    } catch (error) {
        showAlert(error.message, 'error');
    }
});


function deleteUser(id) {
    const user = userService.getById(id);
    console.log(user);
    if (!user) {
        showAlert('User not found', 'error');
        return;
    }

    const userTasks = taskManager.getByUser(id);
    let confirmMessage = `Are you sure you want to delete "${user.name}"?`;
    if (userTasks.length > 0) {
        confirmMessage += `\n\nThis user has ${userTasks.length} assigned task(s) that will be unassigned.`;
    }else{
        console.log("no tasks for the user")
    }

    if (confirm(confirmMessage)) {
        try {
            let success = userService.deleteUser(id);
            if (success) {
                showAlert(`User "${user.name}" deleted successfully!`);
                displayUser();
                displayTasks();
                populateUserSelect();
            } else {
                showAlert('Failed to delete user', 'error');
            }
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }else{
        console.log("not to delete")
    }
}

function editTask(id) {
    const task = taskManager.getById(id);
    if (!task) {
        showAlert('Task not found', 'error');
        return;
    }
    document.getElementById('edit-task-id').value = task.id;
    document.getElementById('edit-task-role').value = task.role;
    openModal('edit-task-modal');
}

function deleteTask(id) {
    const task = taskManager.getById(id);
    if (!task) {
        showAlert('Task not found', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete the task "${task.role}"?`)) {
        try {
            const success = taskManager.deleteTask(id);
            if (success) {
                showAlert(`Task "${task.role}" deleted successfully!`);
                displayTasks();
            } else {
                showAlert('Failed to delete task', 'error');
            }
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }
}

function assignTask(id) {
    const users = userService.getAllUsers();
    if (users.length === 0) {
        showAlert('No users available. Please create a user first.', 'error');
        return;
    }

    document.getElementById('assign-task-id').value = id;
    populateUserSelect();
    openModal('assign-task-modal');
}

function unassignTask(id) {
    const task = taskManager.getById(id);
    if (!task) {
        showAlert('Task not found', 'error');
        return;
    }

    const user = userService.getById(task.assignedTo);
    const userName = user ? user.name : 'Invalid User';

    if (confirm(`Are you sure you want to unassign the task "${task.role}" from ${userName}?`)) {
        try {
            const success = taskManager.unassignTask(id, task.assignedTo);
            if (success) {
                showAlert(`Task "${task.role}" unassigned successfully!`);
                displayTasks();
            } else {
                showAlert('Failed to unassign task', 'error');
            }
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }
}

// Initialize the UI
function initialize() {
    displayUser();
    displayTasks();
    populateUserSelect();
}

document.addEventListener('DOMContentLoaded', initialize);
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}