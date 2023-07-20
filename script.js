"use strict";

const listBox = document.querySelector(".list-box");
const newTaskBtn = document.querySelector(".button");
const taskInput = document.querySelector(".task-textarea");
const clearListBtn = document.querySelector(".gg-play-list-remove");
const taskCounter = document.querySelector(".counter");
const container = document.querySelector(".container");

let content = [];
let counter = 0;

function addNewTask() {
  // Make the textarea appear or disappear
  newTaskBtn.addEventListener("click", () => {
    taskInput.classList.toggle("hidden");
    taskInput.focus();
    // Reset the textarea
    taskInput.value = "";
  });

  // Function to insert new task into the task text area
  function pushNewTask(txt) {
    content.push({
      text: txt,
      done: false,
    }); // Add the new task to the content array
    listBox.insertAdjacentHTML(
      "beforeend",
      `
      <div class="list-item">
        <i class="gg-check-r"></i>
        <span class="item">${txt}</span>
        <i class="gg-close"></i>
      </div>
    `
    );
    taskInput.value = "";
    saveTasks(); // Call saveTasks() to update the saved tasks in localStorage
  }

  taskInput.addEventListener("keyup", (event) => {
    // Add the written task to the to-do list after pressing enter
    if (event.key === "Enter") {
      const text = taskInput.value.trim();

      if (text !== "") {
        pushNewTask(text);
      }
    }

    if (event.key === "Escape") {
      taskInput.value = "";
      taskInput.classList.add("hidden");
      location.reload(); // Fix bug where done tasks would not get styled unless the page was reloaded, so after you exit the textarea the page reloads
    }
  });
}

// Setter
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(content));
  localStorage.setItem("counter", counter.toString());
}

// Getter
function retrieveTasks() {
  const savedTasks = localStorage.getItem("tasks");
  const savedCounter = localStorage.getItem("counter");

  if (savedTasks) {
    content = JSON.parse(savedTasks);
    // Fill the to-do list with saved tasks
    content.forEach((task) => {
      listBox.insertAdjacentHTML(
        "beforeend",
        `
        <div class="list-item ${task.done ? "done" : ""}">
          <i class="gg-check-r ${task.done ? "done" : ""}"></i>
          <span class="item ${task.done ? "done" : ""}">${task.text}</span>
          <i class="gg-close ${task.done ? "done" : ""}"></i>
        </div>
      `
      );
    });
  }

  if (savedCounter) {
    counter = parseInt(savedCounter);
    taskCounter.textContent = counter.toString();
  }

  checkTaskDone();
}

function checkTaskDone() {
  const taskItems = document.querySelectorAll(".list-item");
  taskItems.forEach((taskItem, index) => {
    const taskCheckbox = taskItem.querySelector(".gg-check-r");
    const taskSpan = taskItem.querySelector("span");
    const taskCloseBtn = taskItem.querySelector(".gg-close");

    taskCheckbox.addEventListener("click", (event) => {
      const isTaskDone = content[index].done;
      taskItem.classList.toggle("done");
      taskCheckbox.classList.toggle("done");
      taskSpan.classList.toggle("done");
      taskCloseBtn.classList.toggle("done");

      content[index].done = !isTaskDone;
      if (!isTaskDone) {
        counter++;
      } else {
        counter--;
      }

      taskCounter.textContent = counter.toString();
      saveTasks(); // Update saved tasks in localStorage
    });
  });
}

function clearList() {
  clearListBtn.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });
}

function closeListItem() {
  const closeBtns = document.querySelectorAll(".gg-close");
  closeBtns.forEach((closeBtn, index) => {
    closeBtn.addEventListener("click", () => {
      content.splice(index, 1); // Remove the task from the content array
      saveTasks(); // Update saved tasks in localStorage

      const taskItem = closeBtn.parentNode;
      taskItem.style.display = "none";

      // Update the index of the remaining tasks
      closeBtns.forEach((btn, i) => {
        if (i > index) {
          content[i - 1].index = i - 1;
        }
      });
    });
  });
}

// Hide textarea if click outside of it
function clickOutside() {
  container.addEventListener("click", () => {
    taskInput.value = "";
    taskInput.classList.add("hidden");
    location.reload();
  });
}

// Tasks calls
addNewTask();
retrieveTasks();
clearList();
closeListItem();
clickOutside();
