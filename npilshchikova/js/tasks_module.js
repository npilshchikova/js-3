var tasksModule = (
    function () {
        var items = [];

        /**
         * Request Tasks array from server
         */
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

        return {
            addItem: function(item) {
                item.id = counter;
                counter++;
                items.push(item);
                return item.id;
            },

            getItems: function() {
                return items;
            },

            getItem: function(id) {
                return items.filter(function(value) {
                    return value.id === id;
                })[0];
            }
        }
    }
)();