var tasksModule = (
    function () {
        var items = [];

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
                var prepareItems = function(items) {
                    var inputItems = JSON.parse(this.responseText);
                    console.log('?', inputItems);
                    items = JSON.parse(this.responseText);
                }
                _getItems('http://127.0.0.1:5000/tasks', prepareItems, items);
                console.log('!!!', items);
            },

            addItem: function(item) {
                item.id = counter;
                counter++;
                items.push(item);
                return item.id;
            },

            getItems: function() {
                return this.items;
            },

            getItem: function(id) {
                return items.filter(function(value) {
                    return value.id === id;
                })[0];
            }
        }
    }
)();

/** Start work with Tasks module */
tasksModule.init();

console.log(tasksModule.getItems());