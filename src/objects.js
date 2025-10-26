class Task {
    constructor(projectName) {
        this.uuid = self.crypto.randomUUID();
        this.projectName = projectName;
        this.title = "Untitled";
        this.dueDate = "2025-01-01";
        this.priority = "Normal";
        this.description = "Lorem ipsum bla bla bla";
        this.isCompleted = false;
    }
}

// Object for storing and accessing project names and tasks
// There should only be a single instance of this running
const projects = {
    list: {"All Tasks": []}, // array to store projects and tasks

    addProject: function(name) {
        this.list[name] = [];
    },

    addTask: function(projectName, task) {
        this.list[projectName].push(task);
    },

    getTask: function(uuid) {
        return this.list["All Tasks"].filter((elem) => elem.uuid === uuid)[0];
    },
};

// Handles display by directly modifying DOM
const displayController = {
    clearContent: function() {
        const contentDiv = document.querySelector("#content");
        contentDiv.replaceChildren();
    },

    // Displays list of tasks within a certain project
    displayProject: function(projectName, taskArray) {
        this.clearContent();

        const contentDiv = document.querySelector("#content");
        const nCompDiv = document.createElement("div");
        const compDiv = document.createElement("div");
        const compH1 = document.createElement("h1");
        
        nCompDiv.id = "notCompleted";
        nCompDiv.id = "completed";

        compH1.textContent = "Completed Tasks";

        compDiv.append(compH1);
        contentDiv.append(nCompDiv);
        contentDiv.append(compDiv);

        // Update project tab class to change style
        const projectList = document.querySelectorAll(".project");
        console.log(projectList)
        projectList.forEach((elem) => {
            if (elem.textContent === projectName) {
                elem.classList.add("active");
            }
        });

        // Display project tasks with a few key properties only
        for (let task of taskArray) {
            const taskDiv = document.createElement("div");
            const taskCheck = document.createElement("input");
            const taskTitle = document.createElement("h2");
            const taskDate = document.createElement("span");
            const taskDesc = document.createElement("p");

            // Need to separate some of these into smaller functions
            taskTitle.textContent = task.title;
            taskCheck.type = "checkbox";
            taskDate.style.justifySelf = "right";
            taskDate.textContent = task.dueDate;
            taskDesc.textContent = task.description;

            this.onChangeTaskPriority(task, taskDiv);

            taskDiv.appendChild(taskCheck);
            taskDiv.appendChild(taskTitle);
            taskDiv.appendChild(taskDate);
            taskDiv.appendChild(taskDesc);
            taskDiv.setAttribute("uuid", task.uuid);
            
            if (!task.isCompleted) {
                nCompDiv.appendChild(taskDiv);
            } else {
                compDiv.appendChild(taskDiv);
            }
        }
    },

    // Displays full task details
    displayTask: function(task) {
        // Clear display and add new divs
        const contentDiv = document.querySelector("#content");
        const taskDiv = document.createElement("div");
        const sideDiv = document.createElement("div");
        const descDiv = document.createElement("div");
        const title = document.createElement("h1");
        const projectNameLabel = document.createElement("label");
        const projectNameMenu = document.createElement("select");

        contentDiv.replaceChildren();
        
        taskDiv.id = "task";
        sideDiv.id = "task sidebar";
        descDiv.id = "task description";

        title.textContent = task.title;

        sideDiv.append(title);
        taskDiv.append(sideDiv);
        taskDiv.append(descDiv);
        contentDiv.append(taskDiv);
    },

    // Updates the class of a task element based on its priority
    // This changes its style. See style.css for more details
    onChangeTaskPriority: function(task, taskElem) {
        switch (task.priority) {
            case "Low": 
                taskElem.classList.add("low");
                break;
            case "Normal": 
                taskElem.classList.add("normal");
                break;
            case "High": 
                taskElem.classList.add("high");
                break;
        }
    }
};

export {Task, projects, displayController};