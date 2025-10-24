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

const projects = {
    list: {"All Tasks": []}, // array to store projects and tasks

    addProject: function(name) {
        this.list[name] = [];
    },

    addTask: function(projectName, task) {
        this.list[projectName].push(task);
    },
};

const displayController = {
    displayProject: function(projectName, taskArray) {
        // Select project tab
        const projectList = document.querySelectorAll(".project");
        console.log(projectList)
        projectList.forEach((elem) => {
            if (elem.textContent === projectName) {
                elem.className = "project active";
            }
        });

        // Display tasks
        const nCompDiv = document.querySelector("#notCompleted")
        const compDiv = document.querySelector("#completed")
        for (let task of taskArray) {
            const taskDiv = document.createElement("div");
            const taskCheck = document.createElement("input")
            const taskTitle = document.createElement("h2");
            const taskDate = document.createElement("span");
            const taskDesc = document.createElement("p");

            taskTitle.textContent = task.title;
            taskCheck.type = "checkbox";
            taskDate.textContent = task.dueDate;
            taskDesc.textContent = task.description;

            taskDiv.appendChild(taskCheck);
            taskDiv.appendChild(taskTitle);
            taskDiv.appendChild(taskDate);
            taskDiv.appendChild(taskDesc);
            
            if (!task.isCompleted) {
                nCompDiv.appendChild(taskDiv);
            } else {
                compDiv.appendChild(taskDiv);
            }
        }
    },

    displayTask: function() {

    },
};

export {Task, projects, displayController};