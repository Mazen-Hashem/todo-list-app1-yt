// select elements
const compCount = document.querySelector(".info_container .comp_count"),
      taskCount = document.querySelector(".info_container .task_count");
const taskInput = document.querySelector(".input_container .task_input"),
      addBtn = document.querySelector(".input_container .add_btn"),
      errorMsg = document.querySelector(".input_container .error_msg");
const completeBtn = document.querySelector(".result_container .complete_btn"),
      deleteBtn = document.querySelector(".result_container .delete_btn"),
      taskMsg = document.querySelector(".result_container .task_msg"),
      tasksList = document.querySelector(".result_container .tasks_list");

// add and delete every task that user make
let tasksArray = [];
// number of completed task
let completedCounter = 0;
// number of tasks
let taskCounter = 0;

// print as default
counters();

// on window loading focus on input and empty it
window.addEventListener("load", _ => {
  taskInput.value = "";
  taskInput.focus();
  getStorageData();
  noTaskMessage();
});

// on unfocus from input active it if not empty, unactive if empty
taskInput.addEventListener("blur", _ => {
  if (taskInput.value !== "") {
    taskInput.classList.add("active_task_input");
  } else {
    taskInput.classList.remove("active_task_input");
  };
});

// control addbtn by keyboard Enter button
document.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    addBtn.classList.add("active_add_btn");
  };
});
document.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    addBtn.classList.remove("active_add_btn");
    addBtn.click();
  };
});

addBtn.addEventListener("click", _ => {
  let validatValue = true;
  let msgType;
  let repetedTaskIndex;

  if (taskInput.value !== "") {
    // check if input value is already exist in tasks or not
    for (let i = 0; i < tasksArray.length; i++) {
      // if exist make validat false
      if (taskInput.value.toLowerCase() === tasksArray[i].taskValue.toLowerCase()) {
        validatValue = false;
        repetedTaskIndex = i + 1;
      };
    };

    // if validat true add task, if not send msg
    if (validatValue) {
      // build task and add it to the array
      dataTask();
    } else {
      // print msg function
      msgType = `Task Already Exist At number ${repetedTaskIndex}...`;
      errorMessage(msgType);
    };

    // after adding the task, empty
    taskInput.value = "";
  } else {
    // print msg function
    msgType = "Fill The Input...";
    errorMessage(msgType);
  };
  // focus the input
  taskInput.focus();
});

function errorMessage(msg) {
  // print msg and remove it after 3s
  errorMsg.innerHTML = msg;
  setTimeout(() => {
    errorMsg.innerHTML = "";
  }, 3000);
};

function noTaskMessage() {
  // add or remove task msg depends on array
  if (tasksArray.length === 0) {
    taskMsg.classList.add("active_task_msg");
  } else {
    taskMsg.classList.remove("active_task_msg");
  };
};

function dataTask() {
  // build the task id from the date of the add
  let dateId = new Date().getTime();
  // data of every task get add
  tasksArray.push({
    taskValue: taskInput.value,
    taskId: dateId,
    taskCompletion: false,
  });
  handleFunctions();
};

function handleFunctions() {
  noTaskMessage();

  // print tasks that added in the array
  createTask(tasksArray.length - 1);

  // +1 task and print
  taskCounter++;
  counters();

  // add task to local storage
  HandleStorage();
};

function createTask(i) {
  // create li (task box)
  const taskItem = document.createElement("li");
  if (tasksArray[i].taskCompletion) {
    taskItem.classList.add("task_item");
    taskItem.classList.add("done_task_item");
  } else {
    taskItem.classList.add("task_item");
  };
  taskItem.id = tasksArray[i].taskId;
  taskItem.setAttribute("data-completion", tasksArray[i].taskCompletion);

  // create p (task numb)
  const taskNumb = document.createElement("p");
  taskNumb.classList.add("task_numb");
  taskNumb.innerHTML = taskCounter + 1;
  taskItem.appendChild(taskNumb);

  // create p (task value)
  const taskText = document.createElement("p");
  taskText.classList.add("task_text");
  taskText.innerHTML = tasksArray[i].taskValue;
  taskItem.appendChild(taskText);

  // create button (delete)
  const taskDeleteBtn = document.createElement("button");
  taskDeleteBtn.classList.add("task_delete_btn");
  taskDeleteBtn.innerHTML = "Delete";
  taskItem.appendChild(taskDeleteBtn);

  // put li box in ul list
  tasksList.appendChild(taskItem);
};

document.addEventListener("click", e => {
  // if the clicked element is li
  if (e.target.classList.contains("task_item")) {
    handleCompletion(e.target);
    // if the clicked element is li child (p text)
  } else if (e.target.classList.contains("task_text")) {
    handleCompletion(e.target.parentNode);
    // if the clicked element is li child (button delete)
  } else if (e.target.classList.contains("task_delete_btn")) {
    handleDeletion(e.target.parentNode);
  };
});

function handleCompletion(e) {
  // add and remove done class
  e.classList.toggle("done_task_item");
  for (let i = 0; i < tasksArray.length; i++) {
    // search for the clicked element in the array and change its completion value depends on done class
    if (parseInt(e.id) === tasksArray[i].taskId) {
      if (e.classList.contains("done_task_item")) {
        tasksArray[i].taskCompletion = true;
        e.dataset.completion = true;
        // +1 complete and print
        completedCounter++;
        counters();
        // add the new change in the local storage
        HandleStorage();
      } else {
        tasksArray[i].taskCompletion = false;
        e.dataset.completion = false;
        // -1 complete and print
        completedCounter--;
        counters();
        // add the new change in the local storage
        HandleStorage();
      };
    };
  };
};

function handleDeletion(e) {
  // remove the element
  e.remove();
  for (let i = 0; i < tasksArray.length; i++) {
    // search for the clicked element in the array and remove it
    if (parseInt(e.id) === tasksArray[i].taskId) {
      tasksArray.splice(i, 1);
    };
  };
  // -1 task and print
  taskCounter--;
  counters();
  // if the deleted element was completed
  if (e.dataset.completion === "true") {
    // -1 task and complete and print
    completedCounter--;
    counters();
  };
  handleTaskNumb();
  noTaskMessage();
  // add the new change in the local storage
  HandleStorage();
};

completeBtn.addEventListener("click", _ => {
  // make array from li element
  const taskItems = Array.from(document.querySelectorAll(".result_container .task_item"));
  // make all completed and true
  taskItems.forEach((item, index) => {
    if (!item.classList.contains("done_task_item")) {
      item.classList.add("done_task_item");
      tasksArray[index].taskCompletion = true;
      item.dataset.completion = true;
      // complete all and print
      completedCounter = taskItems.length;
      counters();
      // add the new change in the local storage
      HandleStorage();
    };
  });
});

deleteBtn.addEventListener("click", _ => {
  // make array from li element
  const taskItems = Array.from(document.querySelectorAll(".result_container .task_item"));
  // delete all
  taskItems.forEach(item => {
    if (taskItems.length !== 0) {
      item.remove();
      tasksArray = [];
      // delete all and print
      completedCounter = 0;
      taskCounter = 0;
      counters();
      // add the new change in the local storage
      HandleStorage();
    };
  });
  noTaskMessage();
});

function counters() {
  compCount.innerHTML = completedCounter;
  taskCount.innerHTML = taskCounter;
};

function handleTaskNumb() {
  // make array from p (task numb) element
  const taskNumbs = Array.from(document.querySelectorAll(".result_container .task_numb"));

  // renumber tasks after single deletion
  for (let i = 0; i < taskCounter; i++) {
    taskNumbs[i].innerHTML = i + 1;
  };
};

//============= local storage =============//
function HandleStorage() {
  // convert js array to json array
  let tasksJson = JSON.stringify(tasksArray);
  // add to local storage
  localStorage.setItem("tasksStorage", tasksJson);
};

function getStorageData() {
  // check if there is a key with this name in local stronge
  if (localStorage.getItem("tasksStorage")) {
    // convert json array to js array
    let tasksStorage = JSON.parse(localStorage.getItem("tasksStorage"));
    // add to the main array
    tasksArray = tasksStorage;
    
    // print it
    for (let i = 0; i < tasksArray.length; i++) {
      createTask(i);
      // +1 completion counter if true
      if (tasksArray[i].taskCompletion) {
        completedCounter++;
      };
      // +1 for every task
      taskCounter = i + 1;
    };
    // print new numbers
    counters();
    handleTaskNumb();
  };
};
