import "./style.css";
import {Task, projects, displayController} from "./objects.js";

// Dummy tasks for now
const firstTask = new Task("All Tasks");
projects.addTask("All Tasks", firstTask);
const secondTask = new Task("All Tasks");
projects.addTask("All Tasks", secondTask);
const thirdTask = new Task("All Tasks");
projects.addTask("All Tasks", thirdTask);

displayController.displayProject("All Tasks", projects.list["All Tasks"]);

// Handles click events
document.addEventListener("click", (e) => {
    // If user clicks on task without slecting the checkbox, display task details
    if (e.target.hasAttribute("uuid")) {
        const task = projects.getTask(e.target.getAttribute("uuid"));
        displayController.displayTask(task);
    } else if (e.target.parentElement.hasAttribute("uuid") && e.target.type !== "checkbox") {
        const task = projects.getTask(e.target.parentElement.getAttribute("uuid"));
        displayController.displayTask(task);
    }
});

console.log(projects.list);

