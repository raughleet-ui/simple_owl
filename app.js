const { Component, xml, mount, useState } = owl;

class Task extends Component {
  static template = xml`
    <li t-attf-style="background-color:#{state.color}" class="d-flex align-items-center justify-content-between border p-3 mb-2">
        <div t-if="state.isEditing" class="d-flex align-items-center flex-grow-1 me-2">
            <input type="text" class="form-control me-2" t-model="state.name"/>
            <input type="color" style="width:60px" class="form-control-lg form-control-color border-0 bg-white m-0" id="color" title="Choose your color" t-model="state.name"/>
        </div>
        <div t-if="!state.isEditing" class="form-check form-switch fs-5">
            <input class="form-check-input" type="checkbox" value="" t-att-checked="state.isCompleted" t-att-id="state.id"
            t-on-click="toggleTask" t-model="state.isCompleted"/>
                <label class="form-check-label" t-att-for="state.id" t-attf-class="#{state.isCompleted ? 'text-decoration-line-through' : ''}">
                    <t t-esc="state.name"/>
                </label>
        </div>
        <div>
            <button  t-if="!state.isEditing"  class="btn btn-primary" t-on-click="editTask"> <i class="bi bi-edit-lg fs-3 bi-pencil"></i> </button>
            <button  t-if="state.isEditing" class="btn btn-primary" t-on-click="saveTask"> <i class="bi bi-edit-lg fs-3 bi-check-lg"></i> </button>
            <button class="btn btn-danger" t-on-click="deleteTask"> <i class="bi bi-edit-lg fs-3 bi-trash"></i> </button>
        </div>
    </li>`;

  static props = ["task", "onDelete", "onEdit"];

  setup() {
    this.state = useState({
      isEditing: false,
      id: this.props.task.id,
      name: this.props.task.name,
      color: this.props.task.color,
      isCompleted: this.props.task.isCompleted,
    });
  }

  toggleTask() {
    this.props.task.isCompleted = !this.props.task.isCompleted;
  }

  deleteTask() {
    this.props.onDelete(this.props.task);
  }

  editTask() {
    this.state.isEditing = true;
  }

  saveTask() {
    this.state.isEditing = false;
    this.props.onEdit(this.state);
  }
}

class Root extends Component {
  static template = xml`
        <div>
            <div class="input-group-lg w-100 d-flex border rounded p-2 align-items-center" >
              <input type="text" class="form-control-lg flex-fill border-0 fs-5 me-1" placeholder="Add your new task!!!" aria-label="Add your new task!!!" 
              aria-describedby="button-addon2" t-model="state.name" t-att-value="state.name"/>
              <input type="color" class="form-control-lg form-control-color border-0 bg-white m-0" id="color" 
              t-att-value="state.color" title="Choose your color" t-model="state.color"/>
              <button class="btn btn-primary" type="button" id="button-addon2" t-on-click="addTask">
                <i class="bi bi-plus-lg fs-3"></i>
              </button>
            </div>
        </div>
        <ul class="d-flex flex-column mt-5 p-0">
            <t t-foreach="tasks" t-as="task" t-key="task.id">
               <Task task="task" onDelete.bind="deleteTask" onEdit.bind="editTask"/>
            </t>
        </ul>`;

  static components = { Task };

  setup() {
    this.state = useState({
      name: "",
      color: "#fff000",
      isCompleted: false,
    });

    this.tasks = useState([]);
  }

  // add dynamic list of tasks
  addTask() {
    if (!this.state.name) {
      alert("Please provide me name of task.");
      return;
    }

    const id = Math.random().toString().substring(2, 12);

    this.tasks.push({
      id: id,
      name: this.state.name,
      color: this.state.color,
      isCompleted: false,
    });

    let state = this.state;
    this.state = { ...state, name: "", color: "#FFF000" };

    console.log(this.tasks);
  }
  deleteTask(task) {
    const index = this.tasks.findIndex((t) => t.id == task.id);
    this.tasks.splice(index, 1);
  }
  editTask(task) {
    const index = this.tasks.findIndex((t) => t.id == task.id);
    this.tasks.splice(index, 1, task);
  }
}

// await để đảm bảo Owl xử lý async mount
mount(Root, document.body, { target: document.getElementById("root") });
