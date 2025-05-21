var User = /** @class */ (function () {
    function User(id, name, age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }
    return User;
}());
var Task = /** @class */ (function () {
    function Task(id, title, assignedTo) {
        this.id = id;
        this.title = title;
        this.assignedTo = assignedTo;
    }
    return Task;
}());
var UserService = /** @class */ (function () {
    function UserService() {
        this.users = [];
        this.generateID = 1;
    }
    UserService.prototype.createUser = function (name, age) {
        var user = new User(this.generateID++, name, age);
        this.users.push(user);
        return user;
    };
    UserService.prototype.getAllUsers = function () {
        return this.users;
    };
    UserService.prototype.getUserByID = function (id) {
        return this.users.find(function (user) { return user.id === id; });
    };
    UserService.prototype.getUsersByAge = function (age) {
        return this.users.filter(function (user) { return user.age === age; });
    };
    UserService.prototype.updateUser = function (id, updateDetails) {
        var user = this.getUserByID(id);
        if (user) {
            user.name = updateDetails.name;
            user.age = updateDetails.age;
            return true;
        }
        return false;
    };
    UserService.prototype.deleteUser = function (id) {
        var userIndex = this.users.findIndex(function (user) { return user.id === id; });
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            return true;
        }
        return false;
    };
    return UserService;
}());
var TaskService = /** @class */ (function () {
    function TaskService() {
        this.tasks = [];
        this.generateID = 1;
    }
    TaskService.prototype.createTask = function (title) {
        var task = new Task(this.generateID++, title);
        this.tasks.push(task);
        return task;
    };
    TaskService.prototype.getAllTasks = function () {
        return this.tasks;
    };
    TaskService.prototype.getTaskByID = function (id) {
        var taskFound = this.tasks.find(function (task) { return task.id === id; });
        if (taskFound) {
            return {
                id: taskFound.id,
                title: taskFound.title,
            };
        }
    };
    TaskService.prototype.updateTask = function (id, newTitle) {
        var task = this.getTaskByID(id);
        if (task) {
            task.title = newTitle;
            return true;
        }
        return false;
    };
    TaskService.prototype.deleteTask = function (id) {
        var taskIndex = this.tasks.findIndex(function (task) { return task.id === id; });
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
            return true;
        }
        return false;
    };
    TaskService.prototype.assignTask = function (taskId, userId) {
        var task = this.getTaskByID(taskId);
        if (task) {
            task.assignedTo = userId;
            return true;
        }
        return false;
    };
    TaskService.prototype.unassignTask = function (taskId) {
        var task = this.getTaskByID(taskId);
        if (task) {
            task.assignedTo = undefined;
            return true;
        }
        return false;
    };
    TaskService.prototype.getTasksByUser = function (userId) {
        return this.tasks.filter(function (task) { return task.assignedTo === userId; });
    };
    return TaskService;
}());
var userService = new UserService();
var user1 = userService.createUser("Nick", 38);
var user2 = userService.createUser("John", 27);
var user3 = userService.createUser("Liz", 22);
var user4 = userService.createUser("Mel", 24);
var taskService = new TaskService();
var task1 = taskService.createTask("Finish Website assignment");
var task2 = taskService.createTask("Be audible");
var task3 = taskService.createTask("Learn Typescript");
var task4 = taskService.createTask("Practice story-telling");
console.log("------------------------------------------");
console.info("All Users:", userService.getAllUsers());
console.log("");
console.info("All Tasks: ", taskService.getAllTasks());
console.log("");
console.info("Tasks Assigned to: ", user1.name, "-", taskService.getTaskByID(user1.id));
console.log("------------------------");
