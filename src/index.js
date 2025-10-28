import "./style.css";
import { Task, projects, displayController } from "./objects.js";


// Dummy tasks for now
const firstTask = new Task("All Tasks");
projects.addTask("All Tasks", firstTask);
const secondTask = new Task("All Tasks");
projects.addTask("All Tasks", secondTask);
const thirdTask = new Task("All Tasks");
projects.addTask("All Tasks", thirdTask);

let activeTask;
let activeProject = "All Tasks";

displayController.displayProject(activeProject, projects.list[activeProject]);

// Handles click events
document.addEventListener("click", (e) => {
    // If user clicks on task without slecting the checkbox, display task details
    if (e.target.hasAttribute("uuid")) {
        activeTask = projects.getTask(e.target.getAttribute("uuid"));
        displayController.displayTask(activeTask);
    } else if (e.target.parentElement.hasAttribute("uuid") && e.target.type !== "checkbox") {
        activeTask = projects.getTask(e.target.parentElement.getAttribute("uuid"));
        displayController.displayTask(activeTask);
    } else if (e.target.className === "task markCompleted") {
        activeTask.isCompleted = !activeTask.isCompleted;
        e.target.textContent = (activeTask.isCompleted) ? "Mark Incompleted" : "Mark Completed";
    } else if (e.target.className === "task discard") {
        displayController.displayProject(activeProject, projects.list[activeProject])
    } else if (e.target.className === "task save") {
        const form = document.querySelectorAll('[form="task"]');
        activeTask.title = form[0].value;
        activeTask.projectName = form[1].value;
        activeTask.dueDate = form[2].value;
        activeTask.priority = form[3].value;
        activeTask.description = form[4].value;

        displayController.displayProject(activeProject, projects.list[activeProject]);
    } else if (e.target.classList.contains("project")) {
        activeProject = e.target.textContent;
        displayController.displayProject(activeProject, projects.list[activeProject]);
    } else if (e.target.getAttribute("type") === "checkbox") {
        const uuid = e.target.parentElement.getAttribute("uuid");
        activeTask = projects.getTask(uuid);
        activeTask.isCompleted = !activeTask.isCompleted;
        displayController.displayProject(activeProject, projects.list[activeProject]);
    }
});

document.addEventListener("submit", (e) => {
    // e.preventDefault();
    console.log("boop")
});

console.log(projects.list);