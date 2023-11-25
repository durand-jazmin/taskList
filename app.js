//Activar / desactivar modo oscuro
const toggleDarkMode = () => {
  const body = document.body;
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    body.style.setProperty(
      //colores modo claro
      "--primary-color",
      "#3a3a3a",
      "--secondary",
      "   #6b6b6b",
      " --light",
      " #d9d9d9",
      "--dark",
      "#333333",
      "--disabled",
      "#cccccc",
      "color",
      " #000"
    );
    // Cambiar otras variables para el modo oscuro
  } else {
    body.style.setProperty(
      "--primary-color",
      " #596275",
      "--secondary",
      " #8390a2",
      " --light",
      " #e6f0ff",
      "--dark",
      "#333333",
      "--disabled",
      "#cccccc",
      "color",
      "#555 "
    );
  }
};

document
  .getElementById("darkModeBtn")
  .addEventListener("click", toggleDarkMode);

//Información de la fecha
document.addEventListener("DOMContentLoaded", function () {
  const dateNumber = document.getElementById("dateNumber");
  const dateText = document.getElementById("dateText");
  const dateMonth = document.getElementById("dateMonth");
  const dateYear = document.getElementById("dateYear");

  //Contenedor de fecha
  const dateContainer = document.querySelector(".dateContainer");

  const setDate = () => {
    const date = new Date();
    const options = {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    dateNumber.textContent = date.toLocaleDateString("es", { day: "numeric" });
    dateText.textContent = date.toLocaleDateString("es", { weekday: "long" });
    dateMonth.textContent = date.toLocaleDateString("es", { month: "short" });
    dateYear.textContent = date.toLocaleDateString("es", { year: "numeric" });
  };

  setDate();

  //Función para obtener las tareas del localStorage
  function getTasksFromLocalStorage() {
    let tasks = localStorage.getItem("tasks") || "[]";
    return JSON.parse(tasks);
  }

  //Función para agregar tareas al localStorage
  function saveTasksToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  //Función para agregar tareas en la lista
  function renderTasks() {
    const tasks = getTasksFromLocalStorage();
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `task-${index}`;

      const label = document.createElement("label");
      label.htmlFor = `task-${index}`;
      label.appendChild(document.createTextNode(task));

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "👍";
      deleteButton.addEventListener("click", function () {
        deleteTask(index);
      });
      //li.appendChild(checkbox);
      li.appendChild(label);
      li.appendChild(deleteButton);

      taskList.appendChild(li);

      // Maneja el evento cuando se marca o desmarca un checkbox
      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          deleteButton.style.display = "inline"; // Muestra el botón de eliminar
        } else {
          deleteButton.style.display = "none"; // Oculta el botón de eliminar
        }
      });
    });
  }

  //Función para eliminar una tarea
  function deleteTask(index) {
    let tasks = getTasksFromLocalStorage();
    tasks.splice(index, 1);
    saveTasksToLocalStorage(tasks);
    renderTasks();
  }

  //Agrega evento al formulario para agregar tareas
  document.getElementById("task-form").addEventListener("submit", function (e) {
    e.preventDefault();
    let taskInput = document.getElementById("task-input");
    let newTask = taskInput.value.trim();
    if (newTask) {
      let tasks = getTasksFromLocalStorage();
      tasks.push(newTask);
      saveTasksToLocalStorage(tasks);
      renderTasks();
    }
    taskInput.value = "";
  });

  //Agrega evento al botón de reset para borrar las tareas y la lista
  document
    .getElementById("reset-button")
    .addEventListener("click", function () {
      localStorage.removeItem("tasks");
      const taskList = document.getElementById("task-list");
      taskList.innerHTML = "";
    });

  //Ordena la lista despues de borrar un elemento
  const ordenarBoton = document.getElementById("ordenarTareas");

  // Agrega un event listener para el clic en el botón
  ordenarBoton.addEventListener("click", function () {
    sortTasksByOrder();
  });

  function sortTasksByOrder() {
    let tasks = getTasksFromLocalStorage();
    tasks.sort((a, b) => {
      return a.order - b.order;
    });

    saveTasksToLocalStorage(tasks);
    renderTasks();
  }

  function deleteTask(index) {
    let tasks = getTasksFromLocalStorage();
    tasks.splice(index, 1);
    // Recalcula los índices después de eliminar una tarea
    tasks.forEach((task, idx) => {
      task.order = idx;
    });
    saveTasksToLocalStorage(tasks);
    sortTasksByOrder(); // Ordena después de eliminar la tarea y actualizar los índices
  }
  // Inicial renderizado de tareas
  renderTasks();
});
