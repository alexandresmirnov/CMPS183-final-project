var app = function() {

    var self = {
        func: {}
    };


    self.func.getFavoriteRecipes = function(userID){

      console.log("get favorite recipes of", userID);

      $.post(API.getFavoriteRecipes,
        {
          user_id: userID,
        },
        function(data){
          console.log(data);
          self.vue.favoriteRecipes = data.favorite_recipes;
          $('#vue-div').addClass('show');
        }
      );
    };

	  self.func.removeFavoriteRecipe = function(recipeIndex){
      console.log("remove favorite recipe", recipeIndex);

      var recipeID = self.vue.favoriteRecipes[recipeIndex].id;

      console.log("removing recipeID: ", recipeID);

      self.vue.favoriteRecipes.splice(recipeIndex, 1);

      $.post(API.toggleFavoriteRecipe,
        {
          user_id: USER_ID,
          recipe_id: recipeID,
        },
        function(data){

        }
      );
    };

    self.func.showTimes = function(e){
      var faHeart = $(e.target).children()[0];

      $(faHeart).removeClass("fa-heart").addClass("fa-times").addClass("recipe-times-icon");
    };

    self.func.hideTimes = function(e){
      var faHeart = $(e.target).children()[0];

      $(faHeart).addClass("fa-heart").removeClass("fa-times").removeClass("recipe-times-icon");
    };

    Vue.config.silent = false; // show all warnings

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
          favoriteRecipes: [
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
        },
        methods: self.func
    });


    self.vue.getFavoriteRecipes(USER_ID);


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
