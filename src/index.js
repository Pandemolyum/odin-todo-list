import "./style.css";
import { Task, projects, displayController } from "./objects.js";
import { format } from 'date-fns';

let storage = false;
if (isStorageAvailable("localStorage")) {
  console.log("Woohoo storage is available!")
  storage = true;
} else {
  console.log("No storage available :(")
}

if (!storage || !localStorage.getItem("projectsList")) {
    // Start with a few dummy tasks
    const firstTask = new Task("All Tasks");
    projects.addTask("All Tasks", firstTask);
    const secondTask = new Task("All Tasks");
    projects.addTask("All Tasks", secondTask);
    const thirdTask = new Task("All Tasks");
    projects.addTask("All Tasks", thirdTask);
} else {
    projects.list = JSON.parse(localStorage.getItem("projectsList"));
}

let activeTask;
let activeProject = "All Tasks";

for (let project of Object.keys(projects.list)) {
    if (project !== "All Tasks") {
        displayController.displayProjectTab(project);
    }
}
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
    } else if (e.target.className === "task delete") {
        // When clicking the Delete task button
        projects.removeTask(activeProject, activeTask);
        displayController.displayProject(activeProject, projects.list[activeProject]);
    } else if (e.target.className === "task discard") {
        // When clicking the Discard button
        displayController.displayProject(activeProject, projects.list[activeProject]);
    } else if (e.target.className === "task save") {
        // When clicking the Save button
        const form = document.querySelectorAll('[form="task"]');
        activeTask.title = form[0].value;

        // For assigning task to a different project
        if (activeTask.projectName !== form[1].value) {
            projects.removeTask(activeTask.projectName, activeTask);
            activeTask.projectName = form[1].value;
            projects.addTask(form[1].value, activeTask);
        }

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
        // When clicking the Add project button
        displayController.addProject(projects);
    } else if (e.target.classList.contains("addTask")) {
        // When clicking the Add task button
        activeProject = getActiveProject();
        const newTask = new Task(activeProject);
        projects.addTask(activeProject, newTask);
        displayController.displayTask(newTask);
        activeTask = newTask;
    } else if (e.target.classList.contains("removeProject")) {
        // When clicking the Remove Project button
        activeProject = getActiveProject();
        projects.removeProject(activeProject);
        activeProject = "All Tasks";
        displayController.displayProject(activeProject, projects.list[activeProject]);
    }

    localStorage.setItem("projectsList", JSON.stringify(projects.list));
});

function getActiveProject() {
    const activeTab = document.querySelector(".active");
    return activeTab.textContent;
}

// Function copied from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function isStorageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}