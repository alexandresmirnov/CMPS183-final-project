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
    r = db(q).select().first()
    logger.info(r)
    tag_names = []
    
    if r.tags:
        for tag in r.tags:
            tname=(db(db.tags.id == tag).select().first())
            logger.info(tname)
            tag_names.append(tname.name)
    
    recipe = {
        'name': r.name,
        'image': r.image,
        'instr': r.instr,
        'prep_time': r.prep_time,
        'cook_time': r.cook_time,
        'ingredients': r.ingredients,
        'tags': tag_names
    }
    
    return response.json(dict(recipe=recipe))
    
