var app = function() {

  $('#sql_form input[type=image]').addClass('test');

  var self = {
    func: {}
  };

  Vue.config.silent = false; // show all warnings

  self.func.createRecipe = function(){

    console.log("createRecipe");

    var formkey = $('#sql_form input[name="_formkey"]').val();
    var formname = $('#sql_form input[name="_formname"]').val();

    $('#formkey').val(formkey);
    $('#formname').val(formname);

    $('#recipe-form').submit();

  };

  self.func.getTags = function(){
    $.post(API.getTags,
      {},
      function(data){
        console.log("data: ", data);
        var tags = {};

        for(var i = 0; i < data.tags.length; i++){
          var tag = data.tags[i];
          var category = tag.category;

          if(tags[category] == null){
            tags[category] = {};
          }
          tags[category][tag.name] = tag.id
        }

        console.log(tags);
        self.vue.tags = tags;
      }
    );
  };

  self.func.addIngredient = function(){
    this.$data.recipe.ingredients.push("");
  };

  self.func.addInstruction = function(){
    this.$data.recipe.instr.push("");
  };

  self.func.onImageChange = function(e){
   	var files = e.target.files || e.dataTransfer.files;
  	if (!files.length)
    	return;

		console.log(files[0]);

    var file = files[0];

    //self.vue.recipe.image = files[0];
  };

  // Complete as needed.
  self.vue = new Vue({
    el: "#vue-div",
    delimiters: ['${', '}'],
      unsafeDelimiters: ['!{', '}'],
        data: {
          tags: [],
          recipe: {
            name: "",
            image: "",
            description: "",
            instr: [""], // array of strings
            prep_time: 0,
            cook_time: 0,
            ingredients: [""], // array of strings
            tags: [], // array of tag IDs
          },
        },
        methods: self.func
      });

  self.func.getTags();

  return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
