var tasksModule = (
    function () {
        var itemsBox = document.querySelector('#taskbox');

        /**
         * Add task on HTML page
         * 
         * @param {taskItem} taskItem 
         */
        function drawTask(taskItem) {
            var taskBox = document.createElement('div');
            taskBox.setAttribute('class', 'card mb-1');
            taskBox.setAttribute('id', taskItem.id);
            itemsBox.appendChild(taskBox);

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

            if (taskItem.done) {
                taskHeaderText.setAttribute('class', 'text-success');
                taskHeaderText.textContent += ' (Done)';
            } else {
                var doneButton = document.createElement('button');
                doneButton.setAttribute('class', 'btn btn-success m-1');
                doneButton.textContent = 'Done';
                doneButton.addEventListener('click', function() {
                    console.log('Done button');
                    alert('Are you shoure that current task done?');
                });
                taskBody.appendChild(doneButton);

                if (taskItem.taskExpired()) {
                    taskHeaderText.textContent += ' (Expired, Not Done)';
                    taskHeaderText.setAttribute('class', 'text-danger');
                }
            }

            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.setAttribute('class', 'btn btn-danger m-1');
            deleteButton.addEventListener('click', function() {
                console.log('Delete button');
            });
            taskBody.appendChild(deleteButton);

        }

        /**
         * Request Tasks array from server
         */
        function _getItems(url, callback) {
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

        return {

            init() {
                var prepareItems = function() {
                    var inputItems = JSON.parse(this.responseText);
                    for (var i = inputItems.length; i > 0; i--) {
                        // from the last item to first
                        var next = inputItems[i - 1];
                        var nextTask = new taskItem(next.id, next.name, next.description, Date.parse(next.deadline), next.done);
                        drawTask(nextTask);
                    }
                }
                _getItems('http://127.0.0.1:5000/tasks', prepareItems);
            },

            addItem: function(item) {
                item.id = counter;
                counter++;
                items.push(item);
                return item.id;
            }
        }
    }
)();

/** Start work with Tasks module */
tasksModule.init();
