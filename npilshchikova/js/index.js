function _getItems() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var tasksArray = JSON.parse(this.responseText);
            return(tasksArray);
        }
    };
    xmlhttp.open('GET', 'http://127.0.0.1:5000/tasks');
    xmlhttp.send();
}

var items = _getItems();

console.log('!!!!', items);