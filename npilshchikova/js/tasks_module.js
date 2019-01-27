var tasksModule = (
    function () {
        var url = 'http://127.0.0.1:5000/tasks';
        var itemsBox = document.getElementById('taskbox');

        /**
         * Request Tasks array from server
         */
        function _getTasks(url, callback) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.arguments = Array.prototype.slice.call(arguments, 2);
            xmlhttp.callback = callback;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        this.callback.apply(this, this.arguments);
                    } else {
                        console.warn(this.status, this.statusText);
                    }
                }
            };
            xmlhttp.open('GET', url);
            xmlhttp.send();
        }

        /**
         * Add task on HTML page
         * 
         * @param {taskItem} taskItem 
         */
        function _drawTask(taskItem) {
            var taskBox = document.createElement('div');
            taskBox.setAttribute('class', 'task-item-box card mb-1');
            taskBox.setAttribute('id', taskItem.id);
            itemsBox.insertBefore(taskBox, itemsBox.firstChild);

            /** General task box content */
            var taskHeader = document.createElement('div');
            taskHeader.setAttribute('class', 'card-header');
            taskBox.appendChild(taskHeader);

            var taskBody = document.createElement('div');
            taskBody.setAttribute('class', 'card-body');
            taskBox.appendChild(taskBody);

            /** Task header content */
            var taskHeaderText = document.createElement('h5');
            taskHeaderText.textContent = taskItem.name;
            taskHeader.appendChild(taskHeaderText);

            /** Task body content */
            var deadline = document.createElement('h6');
            deadline.textContent = 'Deadline: ' + taskItem.deadline;
            deadline.setAttribute('class', 'card-subtitle mb-2 text-muted');
            taskBody.appendChild(deadline);
      
            var taskContent = document.createElement('p');
            taskContent.setAttribute('class', 'card-text');
            taskContent.textContent = taskItem.description;
            taskBody.appendChild(taskContent);

            var doneButton = document.createElement('button');
            doneButton.setAttribute('class', 'btn btn-success m-1');
            doneButton.textContent = 'Done';
            doneButton.addEventListener('click', function() {
                console.log('Done button');
                if (confirm('Are you shoure that task "' + taskItem.name + '" done?')) {
                    console.log('done');
                } else {
                    console.log('not done');
                }
            });
            taskBody.appendChild(doneButton);

            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.setAttribute('class', 'btn btn-danger m-1');
            deleteButton.addEventListener('click', function() {
                console.log('Delete button');
                if (confirm('Are you shoure you want to delete task "' + taskItem.name + '"?')) {
                    console.log('delete');
                } else {
                    console.log('not delete');
                }
            });
            taskBody.appendChild(deleteButton);

            if (taskItem.done) {
                taskHeaderText.setAttribute('class', 'text-success');
                taskHeaderText.textContent += ' (Done)';
                doneButton.classList.add('hidden');
            } else {
                // task not done
                if (taskItem.taskExpired()) {
                    taskHeaderText.textContent += ' (Expired, Not Done)';
                    taskHeaderText.setAttribute('class', 'text-danger');
                }
            }
        }

        /**
         * Send DELETE request to server and delete Task item from page
         * 
         * @param {number} taskId 
         */
        function _deleteTask(taskId) {
            return;
        }

        /**
         * Send POST request to server and add Task item to page
         */
        function _addTask(url, id, name, description, deadline) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.callback = _drawTask.bind(this);
            xmlhttp.newTask = new taskItem(id, name, description, Date(deadline), false);
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 201) {
                        this.callback.call(this, this.newTask);
                    } else {
                        console.warn(this.status, this.statusText);
                    }
                }
            };
            xmlhttp.open('POST', url + '/' + id);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(JSON.stringify({
                name: name, 
                description: description,
                deadline: deadline,
                done: false
            }));
        }

        /**
         * Set task status to Done (PUT request to server) and update task box
         */
        function _markTaskDone(url, id) {
            return;
        }

        /**
         * Hide tasks which were filtered out
         */
        function _filterTasks(taskStatus, taskDeadline) {
            var renderedTasks = document.getElementsByClassName('task-item-box');
            renderedTasks.forEach(function(taskNode) {
                switch (taskStatus) {
                    case "done":
                        break;
                    case "not done":
                        break;
                    default:
                        break;
                }
            })
        }

        return {

            init() {
                // add listener to `add task` button
                var addTaskButton = document.getElementById('show-add-task');
                addTaskButton.addEventListener('click', function() {
                    addTaskButton.classList.add('hidden');
                    var addTaskBox = document.getElementById('add-task-box');
                    addTaskBox.classList.remove('hidden');
                });

                // add listener to `cansel add task` button
                var cancelAddTaskButton = document.getElementById('cancel-add-task');
                cancelAddTaskButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    document.getElementById('add-task-box').reset();
                    addTaskButton.classList.remove('hidden');
                    var addTaskBox = document.getElementById('add-task-box');
                    addTaskBox.classList.add('hidden');
                });

                // add listener to `submit task form` button
                var submitAddTaskButton = document.getElementById('submit-task-form');
                submitAddTaskButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    var newName = document.getElementById('task-name-input').value;
                    var newDescription = document.getElementById('task-body-input').value;
                    var newDeadline = document.getElementById('task-deadline-input').value;
                    var taskElements = document.getElementsByClassName('task-item-box');
                    var id = 1 + Math.max.apply(null, 
                        Array.prototype.map.call(taskElements, function (value) { return parseInt(value.id) })
                    );
                    _addTask(url, id, newName, newDescription, newDeadline);

                    // clear and hide form
                    document.getElementById('add-task-box').reset();
                    addTaskButton.classList.remove('hidden');
                    var addTaskBox = document.getElementById('add-task-box');
                    addTaskBox.classList.add('hidden');
                });

                // load data from server
                var prepareItems = function() {
                    var inputItems = JSON.parse(this.responseText);
                    for (var i = 0; i < inputItems.length; i++) {
                        // from the last item to first
                        var next = inputItems[i];
                        var nextTask = new taskItem(next.id, next.name, next.description, Date.parse(next.deadline), next.done);
                        _drawTask(nextTask);
                    }
                }
                _getTasks(url, prepareItems);
            }
        }
    }
)();


/** Start work with Tasks module */

tasksModule.init();
