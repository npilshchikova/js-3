var tasksArray = (
    function () {
        var counter = 0;
        var items = [];

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