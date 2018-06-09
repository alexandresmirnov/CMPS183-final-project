// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    self.func = {
        data: {},
    };

    Vue.config.silent = false; // show all warnings

    self.func.getRecipes = function(){
        $.post(API.getRecipes,
            {},
            function(data){
                self.vue.recipes = data.recipes;
            }
        );
    };

    self.func.toggleTag = function(tagIndex){
        console.log("toggle tag", tagIndex);

        var tag = self.vue.tags[tagIndex];

        self.vue.activeFilters[tag.name] = !self.vue.activeFilters[tag.name];



        filtersOn = false;

        for(var tagName in self.vue.activeFilters){
            if(self.vue.activeFilters.hasOwnProperty(tagName)){
              if(self.vue.activeFilters[tagName]){
                filtersOn = true;
                break;
              }
            }
        }

        self.vue.filtersOn = filtersOn;

        self.func.updateFilteredRecipes();
    };

    self.func.searchRecipes = function(){

      console.log("searchRecipes");

      var matchingRecipes = [];
      var searchString = self.vue.searchString.toLowerCase();

      console.log("searchString: ", searchString);

      for(var i = 0; i < self.vue.recipes.length; i++){
        var recipe = self.vue.recipes[i];
        var recipeText = recipe.name + " " + recipe.description.toLowerCase();

        if(recipeText.indexOf(searchString) > -1){
          matchingRecipes.push(recipe);
        }

      }

      self.vue.searchedRecipes = matchingRecipes;

      console.log("searcedRecipes: ", self.vue.searchedRecipes);

      self.func.updateFilteredRecipes();

    };


    self.func.updateFilteredRecipes = function(){
        // TODO: optimize this
        self.vue.filteredRecipes = [];

        var willFilterRecipes = self.vue.searchString != "" ? self.vue.searchedRecipes : self.vue.recipes;

        console.log("to filter: ", willFilterRecipes);

        if(self.vue.filtersOn){
          for(var i = 0; i < willFilterRecipes.length; i++){
              var recipe = willFilterRecipes[i];

              var fitsFilters = true;

              for(var filterName in self.vue.activeFilters){
                  if(self.vue.activeFilters.hasOwnProperty(filterName)){
                    if(self.vue.activeFilters[filterName] && !recipe.tags.includes(filterName)){
                      fitsFilters = false;
                      break;
                    }
                  }
              }

              if(fitsFilters){
                self.vue.filteredRecipes.push(recipe);
              }
          }
        }
        else {
          self.vue.filteredRecipes = willFilterRecipes;
        }


    };

    self.func.displayRecipes = function(){

      console.log("displayRecipes");
      console.log(this);

      console.log(this.$data.filtersOn);

      if(this.$data.filtersOn)
        return this.$data.filteredRecipes;
      else
        return this.$data.recipes;
    };

    self.func.isActiveFilter = function(tagName){
        return this.$data.activeFilters[tagName];
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            searchString: "",
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
            searchedRecipes: [],
            filteredRecipes: [],
            filtersOn: false,
            activeFilters: {
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

    //self.func.getRecipes();
    self.func.updateFilteredRecipes();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
