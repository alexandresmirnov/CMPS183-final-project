def populate_recipe(r):

    logger.info("--------------------populating recipe: -----------")
    logger.info(r)

    if(r is None):
        logger.info("populating null recipe")
        return None
    else:
        favorite = None

        if auth.user is not None:
            user_favorites = db(db.auth_user.id == auth.user.id).select().first().favorites

            for user_favorite in user_favorites:
                if r.id == user_favorite:
                    favorite = True
                    break
                favorite = False

        tags = []
        if r.tags:
            for tagid in r.tags:
                tag = (db(db.tags.id == tagid).select().first())
                if tag:
                    tags.append(tag)

        logger.info(tags)

        return dict(
            id = r.id,
            name = r.name,
            image = r.image,
            description = r.description,
            instr = r.instr,
            prep_time = r.prep_time,
            cook_time = r.cook_time,
            ingredients = r.ingredients,
            tags = tags,
            favorite = favorite,
        )



def get_recipes():
    logger.info("get_recipes")

    q = (db.recipes.id > 0)
    recipes = db(q).select()

    response_recipes = []

    for r in recipes:
        response_recipes.append(populate_recipe(r))


    return response.json(dict(recipes = response_recipes))


def get_recipe():
    logger.info("get_recipe")

    if request.vars.recipe_id == None:
        logger.info("error")

    recipe_id = request.vars.recipe_id

    q = (db.recipes.id == recipe_id)
    r = db(q).select().first()
    logger.info(r)
    tags = []

    if not r:
        logger.info("no such recipe")


    return response.json(dict(recipe=populate_recipe(r)))


def get_tags():
    logger.info("get_tags")

    q = (db.tags.id > 0)
    tags = db(q).select()

    response_tags = []

    if auth.user is not None:
        user = db(db.auth_user.id == auth.user.id).select().first()
        user_favorite_tags = user.favorite_tags if user.favorite_tags else []

        for tag in tags:
            response_tags.append(dict(
                id = tag.id,
                name = tag.name,
                category = tag.category,
                favorite = int(tag.id) in user_favorite_tags,
            ))
    else:
        response_tags = tags

    return response.json(dict(tags=response_tags))


def get_favorite_recipes():
    logger.info("get_favorite_recipes")

    q = (db.auth_user.id == request.vars.user_id)
    user = db(q).select().first()

    favorite_recipes = []

    for favorite_id in user.favorites:
        favorite_recipe = (db(db.recipes.id == favorite_id).select().first())
        populated_recipe = populate_recipe(favorite_recipe)

        if populated_recipe is not None:
            favorite_recipes.append(populated_recipe)

    return response.json(dict(favorite_recipes=favorite_recipes))


def toggle_favorite_recipe():
    logger.info("toggle_favorite_recipe")

    r_id = int(request.vars.recipe_id)
    u_id = request.vars.user_id

    user = db(db.auth_user.id == u_id).select().first()

    user_favorites = user.favorites if user.favorites else []

    logger.info("CURRENT FAVORITES")
    logger.info(user_favorites)

    if r_id in user_favorites:
        logger.info("favorite now, so removing from list")
        user_favorites.remove(r_id)
    else:
        logger.info("not favorite, adding in")
        user_favorites.append(r_id)


    user.update_record(
        favorites = user_favorites
    )

    return "ok"

def toggle_favorite_tag():
    logger.info("toggle_favorite_tag")

    t_id = int(request.vars.tag_id)
    u_id = request.vars.user_id

    user = db(db.auth_user.id == u_id).select().first()

    logger.info("user: ")
    logger.info(user)


    user_favorite_tags = user.favorite_tags

    logger.info("user favorite tags:")
    logger.info(user_favorite_tags)

    if user_favorite_tags is None:
        logger.info("no favorite tags")
        user_favorite_tags = []
    else:
        logger.info("has favorite tags")
        if t_id in user_favorite_tags:
            logger.info("favorite now, so removing from list")
            user_favorite_tags.remove(t_id)
        else:
            logger.info("not favorite, adding in")
            user_favorite_tags.append(t_id)


    user.update_record(
        favorite_tags = user_favorite_tags
    )

    return "ok"



def create_recipe():
    logger.info("create_recipe")

    r = request.vars

    r_id = db.recipes.insert(
        name = r.name,
        image = r.image,
        description = r.description,
        instr = r['instr[]'],
        prep_time = int(r.prep_time),
        cook_time = int(r.cook_time),
        ingredients = r['ingredients[]'],
        tags = r['tags[]'],
    )

    logger.info("new recipe created at id: ")
    logger.info(r_id)

    return response.json(dict(r_id = r_id))
