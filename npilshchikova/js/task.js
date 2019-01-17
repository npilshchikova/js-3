/**
 * ToDo List item object
 * 
 * @param {number}  id          task id, expected to be unique
 * @param {string}  name        short name for task
 * @param {string}  description detailed description
 * @param {Date}    deadline    expired date
 * @param {boolean} done        true if task finished
 */
function taskItem(id, name, description, deadline, done) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.deadline = deadline;
    this.done = done;
}

/**
 * Mark task Item as Done
 */
taskItem.prototype.getDone = function() {
    this.done = true;
    return this;
}

/**
 * Check if current task deadline will be tomorrow
 */
taskItem.prototype.deadlineIsComing = function() {
    if (this.deadline) {
        var today = new Date();
        return (
            today.getFullYear() === this.deadline.getFullYear() 
            & today.getMonth() === this.deadline.getMonth() 
            & today.getDate() === this.deadline.getDate() - 1
        );
    } else {
        // deadline not set
        return false;
    }
}

 /**
 * Check if current task deadline missed
 */
taskItem.prototype.taskExpired = function() {
    if (this.deadline) {
        var today = new Date();
        return (this.deadline < today);
    } else {
        // deadline not set
        return false;
    }
}