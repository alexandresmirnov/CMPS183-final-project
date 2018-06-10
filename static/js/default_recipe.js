// This is the js for the default/index.html view.

var app = function() {

    var self = {
        func: {}
    };

    Vue.config.silent = false; // show all warnings

    self.func.getRecipe = function(){
        console.log("getRecipe");

        $.post(API.getRecipe,
            {
                recipe_id: RECIPE_ID, // constant defined in recipe.html
            },
            function(data){
                console.log("data: ", data);
                self.vue.recipe = data.recipe;
            }
        );
    };


    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            recipe: {},
        },
        methods: self.func
    });


    self.func.getRecipe();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
