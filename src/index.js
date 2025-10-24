import "./style.css";
import {Task, projects, displayController} from "./objects.js";

const firstTask = new Task("All Tasks");
projects.list["All Tasks"].push(firstTask);

console.log(projects.list);

