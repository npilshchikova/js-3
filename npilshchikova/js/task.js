/**
 * ToDo List item object
 * 
 * @param {number}  id          task id, expected to be unique
 * @param {string}  name        short name for task
 * @param {string}  description detailed description
 * @param {string}    deadline    expired date
 * @param {boolean} done        true if task finished
 */
function taskItem(id, name, description, deadline, done) {
    this.id = id;
    this.name = name;
    this.description = description;
    if (deadline) {
        this.deadline = new Date(deadline);
    } else {
        this.deadline = null;
    }
    this.done = done;
}

/**
 * Get string representation for deadline Date in YYYY-MM-DD format
 */
taskItem.prototype.getDeadlineString = function() {
    if (this.deadline) {
        return this.deadline.toISOString().slice(0,10);
    } else {
        return 'not set';
    }
}

/**
 * Check if current task deadline will be tomorrow
 */
taskItem.prototype.deadlineIsComing = function() {
    if (this.deadline) {
        var today = new Date();
        var dayLater = new Date(today.valueOf() + 1000 * 60 * 60 * 24); // number of milliseconds in day
        return (this.deadline > today) && (this.deadline <= dayLater);
    } else {
        // deadline not set
        return false;
    }
}

/**
 * Check if current task deadline is today
 */
taskItem.prototype.deadlineIsHere = function() {
    if (this.deadline) {
        var today = new Date();
        return (
            today.getFullYear() === this.deadline.getFullYear() 
            & today.getMonth() === this.deadline.getMonth() 
            & today.getDate() === this.deadline.getDate()
        );
    } else {
        // deadline not set
        return false;
    }
}

/**
 * Check if current task deadline will be in a week
 */
taskItem.prototype.deadlineInWeek = function() {
    if (this.deadline) {
        var today = new Date();
        var weekLater = new Date(today.valueOf() + 1000 * 60 * 60 * 24 * 7); // number of milliseconds in week
        return (this.deadline > today) && (this.deadline <= weekLater);
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