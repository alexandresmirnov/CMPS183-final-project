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

        var tag = self.vue.tags[tag_index];

        self.vue.active_tags[tag.name] = !self.vue.active_tags[tag.name];

        self.func.update_filtered_recipes();


        filters_on = false;

        for(var tag_name in self.vue.active_tags){
            if(self.vue.active_tags.hasOwnProperty(tag_name)){
              if(self.vue.active_tags[tag_name]){
                filters_on = true;
                break;
              }
            }
        }

        self.vue.filters_on = filters_on;
    };


    self.func.update_filtered_recipes = function(){
        // TODO: optimize this
        self.vue.filtered_recipes = [];

        for(var i = 0; i < self.vue.recipes.length; i++){
            var recipe = self.vue.recipes[i];
            console.log("recipe: ", recipe);

            for(var j = 0; j < self.vue.tags.length; j++){
                var tag = self.vue.tags[j];

                if(self.vue.active_tags[tag.name] && recipe.tags.includes(tag.name)){
                    self.vue.filtered_recipes.push(recipe);
                    break;
                }
            }
        }

        console.log(self.vue.filtered_recipes);
    };

    self.func.display_recipes = function(){

      console.log(this.$data.filters_on);

      if(this.$data.filters_on)
        return this.$data.filtered_recipes;
      else
        return this.$data.recipes;
    };

    self.func.is_active_tag = function(tag_name){
        return this.$data.active_tags[tag_name];
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
                    name: "VV",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ornare, nunc eget malesuada eleifend, nibh sapien porta eros, at vehicula odio quam ut nisl. Nam ex nisl, varius vehicula tortor ac, pellentesque pharetra dolor. Duis posuere, nisi a porttitor maximus, dolor lorem suscipit risus, eu mollis sem eros nec massa. Donec a faucibus arcu. Sed lacinia pretium est, ac volutpat urna consectetur vel. Curabitur ullamcorper bibendum erat, accumsan rhoncus elit semper ac. Fusce sit amet enim id dui porta semper porttitor id mi.",
                    tags: ["Vegetarian", "Vegan"],
                },
                {
                    id: 2,
                    name: "tofu (keto,vegan)",
                    description: "Maecenas lobortis varius augue, ac tincidunt lacus semper maximus. Integer tincidunt gravida leo, quis blandit odio venenatis vel. Morbi ac urna at dui pretium iaculis.",
                    tags: ["Keto", "Vegan"],
                },
                {
                    id: 3,
                    name: "just veg",
                    description: "Suspendisse potenti. Nulla sollicitudin massa nec fringilla ullamcorper. Vestibulum urna mi, vulputate non pellentesque quis, mollis id justo. Etiam consectetur arcu in pretium efficitur. Phasellus tincidunt magna non ex imperdiet auctor. Nam hendrerit dolor tellus, bibendum tristique tellus semper ac. Nulla interdum magna ligula, ut cursus mauris ullamcorper id. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris commodo libero metus, interdum convallis velit pharetra et. In hendrerit lacus id auctor interdum. In nec eros at tortor pharetra luctus eu vel nibh. Donec eget rhoncus quam. Praesent et augue at diam porttitor iaculis. Donec sit amet justo nisi.",
                    tags: ["Vegetarian"],
                },
                {
                    id: 4,
                    name: "just veg",
                    description: "Aliquam auctor nunc at leo pharetra, vitae auctor arcu tempor. Sed porta magna nec mollis pharetra. Vivamus mollis augue ut arcu luctus scelerisque. Proin porttitor elit nisi, eget facilisis mi mollis nec. Proin posuere pulvinar porttitor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
                    tags: ["Vegetarian"],
                },
                {
                    id: 5,
                    name: "just veg",
                    description: "Aliquam blandit erat dui, nec scelerisque magna lobortis in. Morbi lobortis nisi orci. Vestibulum scelerisque velit quam, vitae mattis lorem mattis vel. Maecenas enim lacus, molestie quis purus vel, auctor malesuada turpis. Pellentesque vulputate, enim vel pulvinar pharetra, velit est gravida velit, ut ultrices dolor quam non risus. Nullam gravida fringilla orci et pretium. Donec id massa turpis. Curabitur at suscipit diam.",
                    tags: ["Vegetarian"],
                },
                {
                    id: 6,
                    name: "just veg",
                    description: "Aliquam blandit erat dui, nec scelerisque magna lobortis in. Morbi lobortis nisi orci. Vestibulum scelerisque velit quam, vitae mattis lorem mattis vel. Maecenas enim lacus, molestie quis purus vel, auctor malesuada turpis. Pellentesque vulputate, enim vel pulvinar pharetra, velit est gravida velit, ut ultrices dolor quam non risus. Nullam gravida fringilla orci et pretium. Donec id massa turpis. Curabitur at suscipit diam.",
                    tags: ["Vegetarian"],
                },
            ],
            filtered_recipes: [],
            filters_on: false,
            active_tags: {
                "Vegetarian": false,
                "Keto": false,
                "Vegan": false,
            },
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
