def get_recipes():
    logger.info("get_recipes")

    q = (db.recipes.id > 0)
    recipes = db(q).select()

    return response.json(dict(recipes = recipes))


def get_recipe():
    logger.info("get_recipe")

    if request.vars.recipe_id == None:
        logger.info("error")

    recipe_id = request.vars.recipe_id

    q = (db.recipes.id == recipe_id)
    recipe = db(q).select().first()

    return response.json(dict(recipe = recipe))
