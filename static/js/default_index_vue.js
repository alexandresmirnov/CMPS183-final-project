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

    self.func.toggle_tag = function(tag_index){
        console.log("toggle tag", tag_index);


        self.vue.tags[tag_index].active = !self.vue.tags[tag_index].active;

        self.func.update_filtered_recipes();

    };

    self.func.update_filtered_recipes = function(){
        // TODO: optimize this
        self.vue.filtered_recipes = [];

        for(var i = 0; i < self.vue.recipes.length; i++){
            var recipe = self.vue.recipes[i];
            console.log("recipe: ", recipe);
            for(var j = 0; j < self.vue.tags.length; j++){
                var tag = self.vue.tags[j];
                if(tag.active && recipe.tags.includes(tag.id)){
                    self.vue.filtered_recipes.push(recipe);
                    break;
                }
            }
        }

        console.log(self.vue.filtered_recipes);
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            recipes: [
                {
                    id: 1,
                    name: "salad",
                    description: "description",
                    tags: [1, 2],
                },
                {
                    id: 2,
                    name: "steak",
                    description: "description2",
                    tags: [2],
                },
                {
                    id: 3,
                    name: "Tofu Curry",
                    description: "description2",
                    tags: [3],
                },
            ],
            filtered_recipes: [],
            tags: [
                {
                    id: 1,
                    name: "Vegetarian",
                    active: true,
                },
                {
                    id: 2,
                    name: "Keto",
                    active: true,
                },
                {
                    id: 3,
                    name: "Vegan",
                    active: true,
                },
            ],
        },
        methods: self.func
    });

    //self.func.data.get_recipes();
    self.func.update_filtered_recipes();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
