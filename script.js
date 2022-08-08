let lists = [
	{ id: '1659296415985', name: 'html', tasks: [] },
	{ id: '1659296415986', name: 'css', tasks: [] },
	{ id: '1659296415988', name: 'javascript', tasks: [] },
];

// UI list
const taskList = document.querySelector('.task-list');
// button to add new lists
const newListButton = document.querySelector('.new-task');
const listInput = document.querySelector('.task-input');
const deleteListButton = document.querySelector('.new-delete');
const todoList = document.querySelector('.todo-list');
const todoTitle = document.querySelector('.list-title');
const todoCount = document.querySelector('.task-count');
const todoContainer = document.querySelector('.tasks');
const taskTemplate = document.getElementById('task-template');
const newTodo = document.querySelector('.new-todo');
const todoInput = document.querySelector('.todo-input');

// list id same as list data-list-id in html
let selectedListId = lists[0]?.id;
let selectedList = lists.find((list) => list.id === selectedListId);
console.log(selectedList, selectedListId);

// Lists Class
class List {
	constructor(name, id, tasks) {
		this.name = name;
		this.id = id;
		this.tasks = tasks;
	}
}

// UI Class
class UI {
	addList(name, id, tasks) {
		// if input is empty
		if (listInput.value === null || listInput.value === '') return;
		const list = new List(name, id, tasks);
		lists.push(list);
		selectedListId = list.id;
		selectedList = lists.find((list) => list.id === selectedListId);
		// selectedList.classList.add("active-list");
	}
	renderLists() {
		lists.forEach((list) => {
			const newlist = document.createElement('li');
			// set the data-list-id to the list id
			newlist.dataset.listId = list.id;
			newlist.className = 'list-name';
			newlist.textContent = list.name;
			taskList.append(newlist);
			selectedList = lists.find((list) => list.id === selectedListId);
		});
	}
	renderTodos(currentList) {
		// show or hide todo based on if a list is selected
		if (selectedListId === null) {
			todoList.style.display = 'none';
		} else {
			todoList.style.display = '';
		}
		console.log(currentList);

		currentList?.tasks.forEach((task) => {
			// clone the whole template
			console.log(task);

			const todoElement = document.importNode(taskTemplate.content, true);
			const checkbox = todoElement.querySelector('input');
			checkbox.id = task.id;
			checkbox.checked = task.complete;
			const label = todoElement.querySelector('label');
			label.htmlFor = task.id;
			label.append(task.title);

			todoContainer.appendChild(todoElement);
		});
	}
	clearList(container) {
		// keeps on deleting first child until list is cleared
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
	}
	clearField() {
		listInput.value = '';
	}
	deleteList() {
		lists = lists.filter((list) => list.id !== selectedListId);
	}
	clearActiveList() {
		const lis = taskList.children;
		for (const iterator of lis) {
			iterator.classList.remove('active-list');
		}
	}
	countTodos(currentList) {
		const incompleteTaskCount = currentList.tasks.filter((task) => !task.complete).length;
		todoCount.textContent = `${incompleteTaskCount} tasks remaining`;
	}
}

const ui = new UI();

// Eventlistners
// Add a list
newListButton.addEventListener('click', function (e) {
	e.preventDefault();
	ui.clearList(taskList);
	// Add active list again after clear
	ui.addList(listInput.value, Date.now().toString(), []);
	ui.clearField();
	ui.renderLists();
	ui.countTodos(selectedList);
	ui.clearList(todoContainer);

	for (const task of taskList.children) {
		console.log(task);

		if (task.dataset.listId === selectedListId) task.classList.add('active-list');
	}
});
// Add a todo
newTodo.addEventListener('submit', function (e) {
	e.preventDefault();
	ui.clearList(todoContainer);
	// create a list using the input value and the current data
	if (todoInput.value === null || todoInput.value === '') return;
	selectedList = lists.find((list) => list.id === selectedListId);
	selectedList.tasks.push({ title: todoInput.value, id: Date.now().toString(), complete: false });
	ui.renderTodos(selectedList);
	todoInput.value = '';
	ui.countTodos(selectedList);
});

// Assign data-list-id to selectedListId
taskList.addEventListener('click', (e) => {
	if (e.target.tagName.toLowerCase() === 'li') {
		selectedListId = e.target.dataset.listId;
		selectedList = lists.find((list) => list.id === selectedListId);
		todoTitle.textContent = selectedList.name;
		ui.clearActiveList();
		e.target.classList.add('active-list');
		ui.clearList(todoContainer);
		ui.renderTodos(selectedList);
		ui.countTodos(selectedList);
	}
});
// Delete a list
deleteListButton.addEventListener('click', (e) => {
	ui.deleteList();

	ui.clearList(taskList);

	if (!taskList.firstChild) {
		selectedListId = null;
	}

	selectedListId = lists[0]?.id;
	ui.renderLists();
	taskList.firstElementChild?.classList.add('active-list');
	todoTitle.textContent = selectedList.name;
	ui.clearList(todoContainer);
	ui.renderTodos(selectedList);
});
ui.renderLists();
taskList.firstElementChild?.classList.add('active-list');
ui.renderTodos(selectedList);
ui.countTodos(selectedList);
