document.addEventListener("DOMContentLoaded", function () {
  let username = localStorage.getItem("username");

  if (!username || username.trim() === "") {
    Swal.fire({
      title: "Enter Your Username",
      input: "text",
      inputAttributes: { autocapitalize: "off" },
      confirmButtonText: "Save",
      background: "#212529",
      color: "#dc3545",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("username", result.value);
        Swal.fire({
          title: "Saved!",
          text: `Your username: ${result.value}`,
          icon: "success",
          background: "#212529",
          color: "#dc3545",
          iconColor: "#dc3545",
        });
        const nameHoster = document.getElementById("name");

        let username = localStorage.getItem("username");

        if (!username || username === "") {
          username = "User";
        }
        nameHoster.innerHTML = username;
      }
    });
  }

  let button = document.getElementById("NewListButton");
  let listContainer = document.getElementById("cards");

  if (button) {
    button.addEventListener("click", function () {
      Swal.fire({
        title: "Enter List Title",
        input: "text",
        inputAttributes: { autocapitalize: "off" },
        confirmButtonText: "Save",
        background: "#212529",
        color: "#dc3545",
      }).then((result) => {
        if (result.isConfirmed) {
          let ListArray = JSON.parse(localStorage.getItem("list")) || [];

          let newList = {
            title: result.value,
            tasks: [],
            bgColor: "#212529",
          };

          ListArray.push(newList);
          saveLists(ListArray);
          renderLists();
        }
      });
    });
  } else {
    console.error("❌ NewListButton undefined");
  }

  function saveLists(ListArray) {
    localStorage.setItem("list", JSON.stringify(ListArray));
  }

  function renderLists() {
    listContainer.innerHTML = "";
    let ListArray = JSON.parse(localStorage.getItem("list")) || [];

    ListArray.forEach((list, listIndex) => {
      let taskItems = list.tasks
        .map(
          (task, taskIndex) => `
            <li class="list-group-item bg-dark text-light border-dark d-flex justify-content-between align-items-center"
                draggable="true"
                ondragstart="drag(event, ${listIndex}, ${taskIndex})">
                ${task}
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${listIndex}, ${taskIndex})">❌</button>
            </li>`
        )
        .join("");

      let item = `
            <div class="card text-light border-light mb-3" style="width: 18rem; background-color: ${list.bgColor};"
                ondragover="allowDrop(event)" ondrop="drop(event, ${listIndex})">
              <div class="card-header d-flex justify-content-between align-items-center">
                <span>${list.title}</span>
                <div>
                  <button class="btn btn-sm btn-warning" onclick="changeColor(${listIndex})">🎨</button>
                  <button class="btn btn-sm btn-danger" onclick="deleteList(${listIndex})">🗑</button>
                </div>
              </div>
              <ul class="list-group list-group-flush">${taskItems}</ul>
              <button class="btn btn-sm btn-light m-2" onclick="addTask(${listIndex})">➕ Add Task</button>
            </div>
          `;

      listContainer.innerHTML += item;
    });

    saveLists(ListArray);
  }

  window.addTask = function (listIndex) {
    Swal.fire({
      title: "Enter Task",
      input: "text",
      inputAttributes: { autocapitalize: "off" },
      confirmButtonText: "Add",
      background: "#212529",
      color: "#dc3545",
    }).then((result) => {
      if (result.isConfirmed) {
        let ListArray = JSON.parse(localStorage.getItem("list")) || [];

        ListArray[listIndex].tasks.push(result.value);
        saveLists(ListArray);
        renderLists();
      }
    });
  };

  window.deleteTask = function (listIndex, taskIndex) {
    let ListArray = JSON.parse(localStorage.getItem("list")) || [];

    ListArray[listIndex].tasks.splice(taskIndex, 1);
    saveLists(ListArray);
    renderLists();
  };

  window.deleteList = function (listIndex) {
    let ListArray = JSON.parse(localStorage.getItem("list")) || [];

    ListArray.splice(listIndex, 1);
    saveLists(ListArray);
    renderLists();
  };

  window.changeColor = function (listIndex) {
    let ListArray = JSON.parse(localStorage.getItem("list")) || [];

    Swal.fire({
      title: "Pick a Background Color",
      html:
        '<input type="color" id="colorPicker" value="' +
        ListArray[listIndex].bgColor +
        '">',
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => {
        return document.getElementById("colorPicker").value;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        ListArray[listIndex].bgColor = result.value;
        localStorage.setItem("list", JSON.stringify(ListArray));
        renderLists();
      }
    });
  };

  let draggedTask = null;
  let draggedFromList = null;

  window.drag = function (event, listIndex, taskIndex) {
    draggedTask = taskIndex;
    draggedFromList = listIndex;
  };

  window.allowDrop = function (event) {
    event.preventDefault();
  };

  window.drop = function (event, targetListIndex) {
    event.preventDefault();

    if (draggedTask !== null && draggedFromList !== null) {
      let ListArray = JSON.parse(localStorage.getItem("list")) || [];

      let task = ListArray[draggedFromList].tasks.splice(draggedTask, 1)[0];
      ListArray[targetListIndex].tasks.push(task);

      saveLists(ListArray);
      renderLists();

      draggedTask = null;
      draggedFromList = null;
    }
  };

  renderLists();
});
