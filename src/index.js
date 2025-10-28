import "./style.css";
import { Task, projects, displayController } from "./objects.js";
import { format } from 'date-fns';

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
        // When clicking a task div in the project list
        activeTask = projects.getTask(e.target.getAttribute("uuid"));
        displayController.displayTask(activeTask);
    } else if (e.target.parentElement.hasAttribute("uuid") && e.target.type !== "checkbox") {
        // When clicking other elements in the task div container
        activeTask = projects.getTask(e.target.parentElement.getAttribute("uuid"));
        displayController.displayTask(activeTask);
    } else if (e.target.className === "task markCompleted") {
        // When clicking the Mark Completed/Incompleted button
        activeTask.isCompleted = !activeTask.isCompleted;
        e.target.textContent = (activeTask.isCompleted) ? "Mark Incompleted" : "Mark Completed";
    } else if (e.target.className === "task discard") {
        // When clicking the Discard button
        displayController.displayProject(activeProject, projects.list[activeProject])
    } else if (e.target.className === "task save") {
        // When clicking the Save button
        const form = document.querySelectorAll('[form="task"]');
        activeTask.title = form[0].value;
        activeTask.projectName = form[1].value;
        activeTask.dueDate = format(form[2].value.replaceAll("-","/"), "yyyy/MM/dd"); // Necessary conversion to avoid a bug
        activeTask.priority = form[3].value;
        activeTask.description = form[4].value;

        displayController.displayProject(activeProject, projects.list[activeProject]);
    } else if (e.target.classList.contains("project")) {
        // When selecting a project tab
        activeProject = e.target.textContent;
        displayController.displayProject(activeProject, projects.list[activeProject]);
    } else if (e.target.getAttribute("type") === "checkbox") {
        // When checking a task to mark as complete/incomplete
        const uuid = e.target.parentElement.getAttribute("uuid");
        activeTask = projects.getTask(uuid);
        activeTask.isCompleted = !activeTask.isCompleted;
        displayController.displayProject(activeProject, projects.list[activeProject]);
    } else if (e.target.id === "addProject") {
        // Add project button
        displayController.addProject(projects);
    } else if (e.target.classList.contains("addTask")) {
        // Add task button
        const newTask = new Task(activeProject);
        projects.addTask(activeProject, newTask);
        displayController.displayTask(newTask);
        activeTask = newTask;
    }
});