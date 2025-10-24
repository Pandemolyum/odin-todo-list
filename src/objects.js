class Task {
    constructor(projectName) {
        this.uuid = self.crypto.randomUUID();
        this.projectName = projectName;
        this.taskName = "";
        this.dueDate = "";
        this.priority = "Normal";
        this.description = "";
    }
}

const projects = {
    list: {"All Tasks": []}, // array to store projects and tasks

    addProject: function(name) {
        return list.push(name);
    }
};

const displayController = {
    displayProject: function() {

    },

    displayTask: function() {

    }
};

export {Task, projects, displayController};