// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    self.func = {
        data: {},
    };

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };


    self.func.data.get_recipes = function(){
        $.post(API.get_recipes,
            {},
            function(data){
                self.vue.recipes = data.recipes;
            }
        );
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            recipes: [
                {
                    name: "name", 
                    description: "description",
                    id: 1
                },
                {
                    name: "name2", 
                    description: "description2",
                    id: 2
                },
            ],
        },
        methods: self.func
    });

    self.func.data.get_recipes();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
