var app = function() {

    var self = {
        func: {}
    };

    Vue.config.silent = false; // show all warnings

    self.func.createRecipe = function(){

        console.log("createRecipe");

        var recipe = self.vue.recipe;

        $.post(API.createRecipe,
            recipe,
            function(data){
                console.log("data: ", data);
            }
        );
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            recipe: {
              name: "",
              image: "",
              description: "",
              instr: "",
              prepTime: 0,
              cookTime: 0,
              ingredients: [],
              tags: [],
            },
        },
        methods: self.func
    });


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
