var tasksModule = (
    function () {
        var url;
        var itemsBox = document.getElementById('taskbox');
        var taskItems = [];

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
            deadline.textContent = 'Deadline: ' + taskItem.getDeadlineString();
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
                if (confirm('Are you shoure that task "' + taskItem.name + '" done?')) {
                    _setTaskDone(url, taskItem.id);
                }
            });
            taskBody.appendChild(doneButton);

            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.setAttribute('class', 'btn btn-danger m-1');
            deleteButton.addEventListener('click', function() {
                if (confirm('Are you shoure you want to delete task "' + taskItem.name + '"?')) {
                    _deleteTask(url, taskItem.id);
                }
            });
            taskBody.appendChild(deleteButton);

            if (taskItem.done) {
                _markTaskDone(taskBox);
            } else {
                // task not done
                if (taskItem.taskExpired()) {
                    taskHeaderText.textContent += ' - Expired!';
                    taskHeaderText.setAttribute('class', 'text-danger');
                }
            }
        }

        /**
         * Mark task as Done
         */
        function _markTaskDone(taskBox) {
            var taskHeaderText = taskBox.getElementsByTagName('h5')[0];
            var doneButton = taskBox.getElementsByClassName('btn-success')[0];
            taskHeaderText.setAttribute('class', 'text-success');
            taskHeaderText.textContent += ' (Done)';
            doneButton.classList.add('hidden');
        }

        /**
         * Send DELETE request to server and delete Task item from page
         */
        function _deleteTask(url, id) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.taskId = id;
            xmlhttp.taskItems = taskItems;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        // remove element from page
                        var taskBox = document.getElementById(this.taskId);
                        taskBox.parentNode.removeChild(taskBox);
                        // remove element from taskItems
                        var index = this.taskItems.map(function(e) { return e.id; }).indexOf(this.taskId);
                        this.taskItems.splice(index, 1);
                    } else {
                        console.warn(this.status, this.statusText);
                    }
                }
            };
            xmlhttp.open('DELETE', url + '/' + id);
            xmlhttp.send();
        }

        /**
         * Send POST request to server and add Task item to page
         */
        function _addTask(url, id, name, description, deadline) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.callback = _drawTask.bind(this);
            xmlhttp.taskItems = taskItems;
            xmlhttp.newTask = new taskItem(id, name, description, deadline, false);
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 201) {
                        this.callback.call(this, this.newTask);
                        // add new task to Items
                        this.taskItems.push(this.newTask);
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
        function _setTaskDone(url, id) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.callback = _markTaskDone;
            xmlhttp.taskItems = taskItems;
            xmlhttp.taskId = id;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        this.callback.call(this, document.getElementById(this.taskId));
                        // update task state in Items
                        var index = this.taskItems.map(function(e) { return e.id; }).indexOf(this.taskId);
                        this.taskItems[index].done = true;
                    } else {
                        console.warn(this.status, this.statusText);
                    }
                }
            };
            xmlhttp.open('PUT', url + '/' + id);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(JSON.stringify({
                done: true
            }));
        }

        /**
         * Hide tasks which were filtered out
         */
        function _filterTasks(taskStatus, taskDeadline) {
            taskItems.forEach(function(task) {
                var filteredByStatus = false;
                var filteredByDeadline = false;

                // check task status
                switch (taskStatus) {
                    case 'done':
                        if (!task.done) { filteredByStatus = true; }
                        break;
                    case 'not done':
                        if (task.done) { filteredByStatus = true; }
                        break;
                    default:
                        break;  // filtered == false
                }

                // check task deadline
                switch (taskDeadline) {
                    case 'expired':
                        if (!task.taskExpired()) { filteredByDeadline = true; }
                        // today tasks may be here, filter them too:
                        if (task.deadlineIsHere()) { filteredByDeadline = true; }
                        break;
                    case 'today':
                        if (!task.deadlineIsHere()) { filteredByDeadline = true; }
                        break;
                    case 'tomorrow':
                        if (!task.deadlineIsComing()) { filteredByDeadline = true; }
                        break;
                    case 'in a week':
                        if (!task.deadlineInWeek()) { filteredByDeadline = true; }
                        // but case 'tomorrow' not interesting here, so:
                        if (task.deadlineIsComing()) { filteredByDeadline = true; }
                        break;
                    default:
                        break;  // filtered == false
                }

                // finally, set task visibility
                var taskBox = document.getElementById(task.id);
                if (filteredByStatus || filteredByDeadline) {
                    if (!taskBox.classList.contains('hidden')) {
                        taskBox.classList.add('hidden');
                    }
                } else {
                    if (taskBox.classList.contains('hidden')) {
                        taskBox.classList.remove('hidden');
                    }
                }
            })
        }

        return {

            init(targetUrl) {
                url = targetUrl;

                // reset selectors
                document.getElementById('task-status-select').selectedIndex = "0";
                document.getElementById('task-deadline-select').selectedIndex = "0";

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
                var prepareItems = function(taskItems) {
                    var inputItems = JSON.parse(this.responseText);
                    for (var i = 0; i < inputItems.length; i++) {
                        // from the last item to first
                        var next = inputItems[i];
                        var nextTask = new taskItem(
                            next.id, 
                            next.name, 
                            next.description, 
                            next.deadline, 
                            next.done
                        );
                        taskItems.push(nextTask);
                        _drawTask(nextTask);
                    }
                }
                _getTasks(url, prepareItems, taskItems);
            },

            filterTasks() {
                var statusFilterState = document.getElementById('task-status-select').value;
                var deadlineFilterState = document.getElementById('task-deadline-select').value;
                _filterTasks(statusFilterState, deadlineFilterState);
            }
        }
    }
)();


/** Start work with Tasks module */

tasksModule.init('http://127.0.0.1:5000/tasks');
