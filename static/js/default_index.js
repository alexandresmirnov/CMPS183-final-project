// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    self.func = {
        data: {},
    };

    Vue.config.silent = false; // show all warnings



    /* ------------------ NOTES ------------------------
      tags, filters: at the moment, this really only supports tags (I haven't even started to look at ingredients)
        but in several places I used the word "filter".  "filter" and "tag" are used interchangeably for now, but eventually,
        the activeFilters object will contain entries both for tags and ingredients

      allRecipes: the "recipes" data entry contains all recipes.
      filteredRecipes: recipes after filters have been applied to either "allRecipes" or "searchedRecipes", depending on if the search
        string is empty or not
      searchedRecipes: recipes after applying search operation on "allRecipes".

      Recipes flow:
        - ** important note **: updateFilteredRecipes is the main manager of what the user sees.  I'll rename this to something more suitable later.
        - front end always takes results of filteredRecipes.  I'll probably rename this to "processedRecipes" for clarity at some point
        - the very last thing to be called after changing recipes data is always updateFilteredRecipes
        - updateFilteredRecipes is called on startup

        cases:
          no filters, no search: allRecipes -> filteredRecipes
          - filteredRecipes = allRecipes
            - updateFilteredRecipes is called, but there are no filters
            - it knows there are no filters because filtersOn = false

          filters, no search: allRecipes -> [filter logic] -> filteredRecipes
          - it knows filters are on because filtersOn = true
          - filtersOn is true because toggleTag() takes care of that when a tag button is pressed
          - updateFilteredRecipes sees that searchString is empty, so uses allRecipes

          filters, search: searchedRecipes -> [filter logic> -> filteredRecipes
          - knows that search is active if searchString is not empty
          - same as "no search" situation, just uses searchedRecipes as array to filter instead of allRecipes


      Search flow: allRecipes -> [search logic] -> searchedRecipes
        - input model is searchString
        - on keyUp events on search textbox, searchRecipes is called
        - calls updateFilteredRecipes after search, so searchedRecipes -> [filter logic] -> filteredRecipes, which user then sees

    */

    // load in tags from server
    self.func.getTags = function(){
        console.log("getRecipes");
        $.post(API.getTags,
            {},
            function(data){
                console.log("tags data: ", data);
                self.vue.tags = data.tags;
            }
        );
    };

    // gets all recipes from getRecipes API endpoint
    self.func.getRecipes = function(){
        console.log("getRecipes");
        $.post(API.getRecipes,
            {},
            function(data){
                console.log("data: ", data);
                self.vue.allRecipes = data.recipes;
                self.func.updateFilteredRecipes();
            }
        );
    };

    // uses searchString (bound to input using v-model) to look through recipes
    // prunes recipes array (all the recipes) into searchedRecipes
    // then calls updateFilteredRecipes to filter the search, in case any filters are active
    self.func.searchRecipes = function(){

      console.log("searchRecipes");

      var matchingRecipes = [];
      var searchString = self.vue.searchString.toLowerCase();

      console.log("searchString: ", searchString);

      for(var i = 0; i < self.vue.allRecipes.length; i++){
        var recipe = self.vue.allRecipes[i];
        var recipeText = recipe.name + " " + recipe.description.toLowerCase(); // get both title content

        if(recipeText.indexOf(searchString) > -1){ // if that text is inside, add it
          matchingRecipes.push(recipe);
        }

      }

      self.vue.searchedRecipes = matchingRecipes;

      console.log("searcedRecipes: ", self.vue.searchedRecipes);

      // call filtered recipes, which will know to use searchedRecipes instead of all recipes to filter
      self.func.updateFilteredRecipes();

    };



    // iterate through array of tag objects of form {name: "name", category: "category"}, true if present
    self.func.tagsContainTagName = function(tags, tagName){

      for(var i = 0; i < tags.length; i++){
        var tag = tags[i];
        if(tag.name == tagName) return true;
      }

      return false;
    }

    // finds matches between filters and recipes such that recipe tags are a superset of the active tags
    // note that there is no "active tags array"; it's an object that we iterate through here to create
    // a conceptual array, i.e. active tags does not look like: ["Vegan", "Keto"], but rather like
    // {"Vegan": true, "Keto", true}
    // this is done because as a result, toggling tags is O(1) as we don't need to look through all the tags
    self.func.updateFilteredRecipes = function(){
        // TODO: optimize this
        self.vue.filteredRecipes = [];

        var willFilterRecipes = self.vue.searchString != "" ? self.vue.searchedRecipes : self.vue.allRecipes;

        if(self.vue.filtersOn){

          for(var i = 0; i < willFilterRecipes.length; i++){
            var recipe = willFilterRecipes[i];

            var fitsFilters = true;

            for(var categoryName in self.vue.filters){
                if(self.vue.filters.hasOwnProperty(categoryName)){

                  var category = self.vue.filters[categoryName];

                  for(var tagName in category){
                    if(category.hasOwnProperty(tagName)){

                      var tag = category[tagName];

                      if(tag.active && !self.func.tagsContainTagName(recipe.tags, tagName)){
                        fitsFilters = false;
                        break;
                      }

                    }
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


    // goes through tag[] and creates filter obj that represents side menu
    self.func.generateFilters = function(){
      var filters = {};
      var tags = self.vue.tags;

      var tag;
      var category;
      for(var i = 0; i < tags.length; i++){
        tag = tags[i];
        category = tag.category;

        if(filters[category] == null){
          filters[category] = {};
        }
        filters[category][tag.name] = {
          active: false,
          favorite: tag.favorite
        }
      }

      console.log("filters:",filters);
      self.vue.filters = filters;

    };


    self.func.toggleTag = function(filterName, tagName){
      self.vue.filters[filterName][tagName].active = !self.vue.filters[filterName][tagName].active;

      filtersOn = false;

      for(var categoryName in self.vue.filters){
        if(self.vue.filters.hasOwnProperty(categoryName)){

          var category = self.vue.filters[categoryName];

          for(var tagName in category){
            if(category.hasOwnProperty(tagName)){

              if(category[tagName].active){
                filtersOn = true;
                break;
              }

            }
          }

        }
      }

      self.vue.filtersOn = filtersOn;
      self.func.updateFilteredRecipes();

    };


    self.func.isActiveTag = function(categoryName, tagName){
      return this.$data.filters[categoryName][tagName].active;
    };

    self.func.toggleTagFavorite = function(categoryName, tagName){
      self.vue.filters[categoryName][tagName].favorite = !self.vue.filters[categoryName][tagName].favorite;

      event.stopPropagation();
    };


    self.func.toggleRecipeFavorite = function(recipe){
      recipe.favorite = !recipe.favorite;
    };


    self.func.isFavoriteRecipe = function(recipe){
      return recipe.favorite;
    };


    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            searchString: "",
            allRecipes: [
                {
                    id: 1,
                    name: "VV",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ornare, nunc eget malesuada eleifend, nibh sapien porta eros, at vehicula odio quam ut nisl. Nam ex nisl, varius vehicula tortor ac, pellentesque pharetra dolor. Duis posuere, nisi a porttitor maximus, dolor lorem suscipit risus, eu mollis sem eros nec massa. Donec a faucibus arcu. Sed lacinia pretium est, ac volutpat urna consectetur vel. Curabitur ullamcorper bibendum erat, accumsan rhoncus elit semper ac. Fusce sit amet enim id dui porta semper porttitor id mi.",
                    tags: [
                      {
                        name: "Vegetarian",
                        category: "Meat preference",
                      },
                      {
                        name: "Vegan",
                        category: "Meat preference",
                      }
                    ],
                    favorite: true,
                },
                {
                    id: 2,
                    name: "tofu (keto,vegan)",
                    description: "Maecenas lobortis varius augue, ac tincidunt lacus semper maximus. Integer tincidunt gravida leo, quis blandit odio venenatis vel. Morbi ac urna at dui pretium iaculis.",
                    tags: [
                      {
                        name: "Keto",
                        category: "Diet",
                      },
                      {
                        name: "Vegan",
                        category: "Meat preference",
                      }
                    ],
                    favorite: false,
                },
                {
                    id: 3,
                    name: "just veg",
                    description: "Suspendisse potenti. Nulla sollicitudin massa nec fringilla ullamcorper. Vestibulum urna mi, vulputate non pellentesque quis, mollis id justo. Etiam consectetur arcu in pretium efficitur. Phasellus tincidunt magna non ex imperdiet auctor. Nam hendrerit dolor tellus, bibendum tristique tellus semper ac. Nulla interdum magna ligula, ut cursus mauris ullamcorper id. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris commodo libero metus, interdum convallis velit pharetra et. In hendrerit lacus id auctor interdum. In nec eros at tortor pharetra luctus eu vel nibh. Donec eget rhoncus quam. Praesent et augue at diam porttitor iaculis. Donec sit amet justo nisi.",
                    tags: [
                      {
                        name: "Vegetarian",
                        category: "Meat preference",
                      },
                      {
                        name: "Vegan",
                        category: "Meat preference",
                      }
                    ],
                    favorite: true,
                },
                {
                    id: 4,
                    name: "just veg",
                    description: "Aliquam auctor nunc at leo pharetra, vitae auctor arcu tempor. Sed porta magna nec mollis pharetra. Vivamus mollis augue ut arcu luctus scelerisque. Proin porttitor elit nisi, eget facilisis mi mollis nec. Proin posuere pulvinar porttitor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
                    tags: [
                      {
                        name: "Vegetarian",
                        category: "Meat preference",
                      },
                    ],
                    favorite: false,
                },
                {
                    id: 5,
                    name: "just veg",
                    description: "Aliquam blandit erat dui, nec scelerisque magna lobortis in. Morbi lobortis nisi orci. Vestibulum scelerisque velit quam, vitae mattis lorem mattis vel. Maecenas enim lacus, molestie quis purus vel, auctor malesuada turpis. Pellentesque vulputate, enim vel pulvinar pharetra, velit est gravida velit, ut ultrices dolor quam non risus. Nullam gravida fringilla orci et pretium. Donec id massa turpis. Curabitur at suscipit diam.",
                    tags: [
                      {
                        name: "Vegetarian",
                        category: "Meat preference",
                      },
                    ],
                    favorite: true,
                },
                {
                    id: 6,
                    name: "just veg",
                    description: "Aliquam blandit erat dui, nec scelerisque magna lobortis in. Morbi lobortis nisi orci. Vestibulum scelerisque velit quam, vitae mattis lorem mattis vel. Maecenas enim lacus, molestie quis purus vel, auctor malesuada turpis. Pellentesque vulputate, enim vel pulvinar pharetra, velit est gravida velit, ut ultrices dolor quam non risus. Nullam gravida fringilla orci et pretium. Donec id massa turpis. Curabitur at suscipit diam.",
                    tags: [
                      {
                        name: "Vegetarian",
                        category: "Meat preference",
                      },
                    ],
                    favorite: false,

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
            filters: {},
            /*

            filters: {
              "Meat preference": {
                "Vegetarian": {
                  active: false,
                  favorite: false,
                }
                "Vegan": {
                  active: false,
                  favorite: false,
                },
              },
              "Diet": {
                "Keto": {
                  active: false,
                  favorite: false,
                }
              }
            }

             */
            tags: [
                {
                    id: 1,
                    name: "Vegetarian",
                    favorite: true,
                    category: "Meat preference",
                },
                {
                    id: 2,
                    name: "Keto",
                    favorite: false,
                    category: "Diet",
                },
                {
                    id: 3,
                    name: "Vegan",
                    favorite: true,
                    category: "Meat preference",
                },
            ],
        },
        methods: self.func
    });

    //self.func.getTags();
    //self.func.getrecipes();

    // not calling self.func.updateFilteredRecipes() b/c getRecipes() already does

    self.func.generateFilters();

    self.func.updateFilteredRecipes();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
