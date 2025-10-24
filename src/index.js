import "./style.css";
import {Task, projects, displayController} from "./objects.js";

const firstTask = new Task("All Tasks");
projects.addTask("All Tasks", firstTask);
const secondTask = new Task("All Tasks");
projects.addTask("All Tasks", secondTask);
const thirdTask = new Task("All Tasks");
projects.addTask("All Tasks", thirdTask);

displayController.displayProject("All Tasks", projects.list["All Tasks"]);

console.log(projects.list);

