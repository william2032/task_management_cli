class User {
    constructor(public id: number, public name: string, public email: string) {
    }
}

class Task {
    constructor(public id: number, public role: string, public assignedTo?: number) {
    }
}

class UserService {
    private users: User[] = [];
    private nextId = 1;

    createUser(name: string, email: string): User {
        const user = new User(this.nextId++, name, email);
        this.users.push(user);
        return user;
    }

    getAllUsers() {
        return this.users;
    }

    getById(id: number) {
        return this.users.find((user) => user.id === id);
    }

    getByEmail(email: string) {
        return this.users.find((user) => user.email === email);
    }

    updateUser(id: number, updates: { name: string, email: string }) {
        const user = this.getById(id);
        if (!user) return false;
        user.name = updates.name ?? user.name;
        user.email = updates.email ?? user.email;
        return true;
    }

    deleteUser(id: number) {
        const userIndex = this.users.findIndex((user) => user.id === id);
        return userIndex !== -1 ? this.users.splice(userIndex, 1) : false;
    }
}

class TaskManager {
    private tasks: Task[] = [];
    private nextTaskId: number = 1;

    createTask(role: string) {
        const task = new Task(this.nextTaskId++, role);
        this.tasks.push(task);
        return task;
    }

    getAllTasks() {
        return this.tasks;
    }

    getById(id: number) {
        const availableTasks = this.tasks.find((task) => task.id === id);
        if (!availableTasks) return false;
        return  this.tasks.find((task) => task.id === id);
    }

    updateTask(id: number, newRole: string) {
        const task = this.getById(id);
        if (!task) return false;
        task.role = newRole;
        return true;
    }

    deleteTask(id: number) {
        const taskIndex = this.tasks.findIndex((task) => task.id === id);
        return taskIndex !== -1 ? this.tasks.splice(taskIndex, 1) : false;
    }

    assignTask(taskId: number, userId: number) {
        const task = this.getById(taskId);
        if (!task) return false;
        task.assignedTo = userId;
        return true;
    }

    unassignTask(taskId: number, userId: number) {
        const task = this.getById(taskId);
        if (!task) return false;
        delete task.assignedTo;
        return true;
    }

    getByUser(userId: number) {
        return this.tasks.filter(task => task.assignedTo === userId);
    }
}

const userService = new  UserService();
const taskManager = new TaskManager();

const user1 =  userService.createUser('William' ,'william@gmail.com');
const user2 = userService.createUser('goodman' ,'goodman@gmail.com');


// userService.updateUser(user1.id,'Jack','jack@gmail.com');
const task1 = taskManager.createTask('Learn Typescript');
const task2 = taskManager.createTask('Finish Assignments');

taskManager.assignTask(task1.id, user1.id);
taskManager.assignTask(task2.id, user2.id);

taskManager.updateTask(task1.id, 'Learn Angular');

// taskManager.unassignTask(task2.id, user2.id);
taskManager.deleteTask(task1.id);

console.log("All Users:", userService.getAllUsers());

console.log("\n");
console.log("All Tasks:", taskManager.getAllTasks());

console.log("\n");
console.log("Tasks for William:", taskManager.getByUser(user1.id));
console.log("Tasks for Goodman:", taskManager.getByUser(user2.id));




