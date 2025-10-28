import { format, isYesterday, isToday, isTomorrow, isBefore } from 'date-fns';

class Task {
    constructor(projectName) {
        this.uuid = self.crypto.randomUUID();
        this.projectName = projectName;
        this.title = "Untitled";
        this.dueDate = format(new Date(), "yyyy/MM/dd"); // Keep format with "/" delimiters to avoid a bug where one day is subtracted from date while formatting
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

    removeProject: function(name) {
        delete this.list[name];
    },

    addTask: function(projectName, task) {
        this.list[projectName].push(task);
    },

    removeTask: function(projectName, task) {
        this.list[projectName] = this.list[projectName].filter((e) => e !== task);
    },

    getTask: function(uuid) {
        for (const project of Object.keys(this.list)) {
            let task = this.list[project].filter((elem) => elem.uuid === uuid);
            if (task.length !== 0) {
                return task[0];
            }
        }
    },

    getAllTasks: function() {
        const taskArray = [];
        for (const project of Object.keys(this.list)) {
            for (const task of this.list[project]) {
                taskArray.push(task);
            }
        }
        return taskArray;
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
        const addTaskButton = document.createElement("button");
        
        nCompDiv.id = "notCompleted";
        compDiv.id = "completed";

        compH1.textContent = "Completed Tasks";
        compH1.className = "completeTitle";

        addTaskButton.textContent = "+ Add Task";
        addTaskButton.className = "task addTask";

        compDiv.append(compH1);
        contentDiv.append(nCompDiv);
        contentDiv.append(compDiv);
        contentDiv.append(addTaskButton);

        // Update project tab class to change style of active project
        const projectList = document.querySelectorAll(".project");
        const previousActive = document.querySelector(".active");
        
        if (previousActive) {
            previousActive.classList.remove("active");
        }

        projectList.forEach((elem) => {
            if (elem.textContent === projectName) {
                elem.classList.add("active");
            }
        });

        // Handle special case where all tasks from all projects must be displayed
        if (projectName === "All Tasks") {
            taskArray = projects.getAllTasks();
        }
        
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
            if (isToday(task.dueDate)) {
                taskDate.textContent = "Today";
            } else if (isTomorrow(task.dueDate)) {
                taskDate.textContent = "Tomorrow";
            } else if (isYesterday(task.dueDate)) {
                taskDate.textContent = "Yesterday";
            } else {
                taskDate.textContent = format(task.dueDate, "dd/MMM/yyyy").replaceAll("/","-"); // Necessary conversion to avoid a bug
            }
            taskDesc.textContent = task.description;

            if (isBefore(task.dueDate, format(new Date(), "yyyy/MM/dd")) && !task.isCompleted) {
                taskDate.style.color = "red";
            }

            this.onChangeTaskPriority(task, taskDiv);

            taskDiv.appendChild(taskCheck);
            taskDiv.appendChild(taskTitle);
            taskDiv.appendChild(taskDate);
            taskDiv.appendChild(taskDesc);
            if (projectName === "All Tasks") {
                const taskProjName = document.createElement("span");
                taskProjName.textContent = task.projectName;
                taskDiv.appendChild(taskProjName);
            }
            taskDiv.setAttribute("uuid", task.uuid);
            
            if (!task.isCompleted) {
                nCompDiv.appendChild(taskDiv);
            } else {
                compDiv.appendChild(taskDiv);
            }
        }
    },

    // Adds a project to the project tab
    addProject: function(projectList) {
        const textbox = document.createElement("textarea");
        const parent = document.querySelector("#addProject");
        textbox.placeholder = "Project Name Here...";
        parent.textContent = "";
        parent.appendChild(textbox);

        parent.addEventListener("keyup", (e) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Prevents spacebar press from triggering click event
            }

            e.target.value = e.target.value.replace("\n", ""); // Prevents skipping lines
        });

        // For some reason, keydown is also required to prevent skipping lines
        // when user holds the Enter button
        parent.addEventListener("keydown", (e) => {
            e.target.value = e.target.value.replace("\n", ""); // Prevents skipping lines
        });
    
        textbox.addEventListener("blur", () => {
            if (textbox.value !== "") {
                projectList.addProject(textbox.value);
                const projectButton = document.createElement("button");
                const projectParent = parent.parentNode;
                projectButton.classList.add("project");
                projectButton.textContent = textbox.value;
                projectParent.insertBefore(projectButton, projectParent.lastElementChild);
            }
            textbox.remove();
            parent.textContent = "+ Add Project";
        });

        textbox.focus();
    },

    // Displays full task details
    displayTask: function(task) {
        // Clear display and add new divs
        const contentDiv = document.querySelector("#content");
        const taskDiv = document.createElement("div");
        const sideDiv = document.createElement("div");
        const descDiv = document.createElement("div");
        const title = document.createElement("textarea");
        const projectDiv = document.createElement("div");
        const projectLabel = document.createElement("label");
        const projectMenu = document.createElement("select");
        const dateDiv = document.createElement("div");
        const dateLabel = document.createElement("label");
        const dateMenu = document.createElement("input");
        const priorityDiv = document.createElement("div");
        const priorityLabel = document.createElement("label");
        const priorityMenu = document.createElement("select");
        const completeButton = document.createElement("button");
        const descButtonDiv = document.createElement("div");
        const desc = document.createElement("textarea");
        const deleteButton = document.createElement("button");
        const discardButton = document.createElement("button");
        const saveButton = document.createElement("button");

        this.clearContent();
        
        taskDiv.id = "task";
        sideDiv.id = "sidebar";
        descDiv.id = "description";
        title.className = "title";
        projectDiv.className = "inputContainer";
        dateDiv.className = "inputContainer";
        dateMenu.type = "date";
        priorityDiv.className = "inputContainer";
        completeButton.className = "task markCompleted";
        desc.className = "desc";
        deleteButton.className = "task delete";
        discardButton.className = "task discard";
        saveButton.className = "task save";
        descButtonDiv.className = "descButtonContainer";
        saveButton.type = "submit";
        desc.placeholder = "Describe this task...";

        title.textContent = task.title;
        projectLabel.textContent = "Project:";
        dateLabel.textContent = "Due Date:";
        priorityLabel.textContent = "Priority:";
        completeButton.textContent = (task.isCompleted) ? "Mark Incompleted" : "Mark Completed";
        deleteButton.textContent = "Delete";
        discardButton.textContent = "Discard";
        saveButton.textContent = "Save";
        desc.value = task.description;

        title.name = "title";
        projectMenu.name = "project";
        dateMenu.name = "date";
        priorityMenu.name = "priority";
        desc.name = "description";
        title.setAttribute("Form", "task");
        projectMenu.setAttribute("Form", "task");
        dateMenu.setAttribute("Form", "task");
        priorityMenu.setAttribute("Form", "task");
        desc.setAttribute("Form", "task");

        this.createOptionElems(["Low", "Normal", "High"], priorityMenu, task.priority);
        this.createOptionElems(Object.keys(projects.list), projectMenu, task.projectName);
        dateMenu.value = format(task.dueDate, "yyyy/MM/dd").replaceAll("/","-"); // Necessary conversion to avoid a bug

        projectDiv.append(projectLabel);
        projectDiv.append(projectMenu);
        dateDiv.append(dateLabel);
        dateDiv.append(dateMenu);
        priorityDiv.append(priorityLabel);
        priorityDiv.append(priorityMenu);
        sideDiv.append(title);
        sideDiv.append(projectDiv);
        sideDiv.append(dateDiv);
        sideDiv.append(priorityDiv);
        sideDiv.append(completeButton);
        descDiv.append(desc);
        descButtonDiv.append(deleteButton);
        descButtonDiv.append(discardButton);
        descButtonDiv.append(saveButton);
        descDiv.append(descButtonDiv);
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
    },

    createOptionElems: function(nameArr, parent, def) {
        for (let name of nameArr) {
            const option = document.createElement("option");
            option.textContent = name;
            option.value = name;
            
            if (def === name) {
                option.setAttribute('selected', true);
            }

            parent.append(option);
        }
    },
};

export { Task, projects, displayController };