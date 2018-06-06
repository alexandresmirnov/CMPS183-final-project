# Here go your api methods.

# returns json of recipes
# this returns recipes without populating ingredients/tags fields
# this is essentially just for metadata
def get_recipes():
    logger.info("get_recipes")

# this one actually populates ingredients/tags
def get_recipes_populated():
    logger.info("get_recipes_populated")


# returns specific recipe by ID
def get_recipe_by_id():
    logger.info("get_recipe_by_id")

# returns array of ingredients for the recipe
# note that this method will do some extra processing to turn
# the table fields into a JSON array for front-end simplicity
def get_ingredients_by_id():
    logger.info("get_ingredients_by_id")


# returns tags for specific recipe ID
def get_tags_by_id():
    logger.info("get_tags_by_id")




