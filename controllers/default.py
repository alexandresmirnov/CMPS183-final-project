# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

# -------------------------------------------------------------------------
# This is a sample controller
# - index is the default action of any application
# - user is required for authentication and authorization
# - download is for downloading files uploaded in the db (does streaming)
# -------------------------------------------------------------------------

# API methods

# returns json of recipes
# this returns recipes without populating ingredients/tags fields
# this is essentially just for metadata
def get_recipes():
    logger.info("get_recipes")

    q = (db.recipes.id > 0)
    recipes = db(q).select()

    return recipes

# this one actually populates ingredients/tags
def get_recipes_populated():
    logger.info("get_recipes_populated")


# returns specific recipe by ID
def get_recipe_by_id(id):
    logger.info("get_recipe_by_id")

    q = (db.recipes.id == id)
    recipe = db(q).select().first()

    return recipe

# returns array of ingredients for the recipe
# note that this method will do some extra processing to turn
# the table fields into a JSON array for front-end simplicity
def get_ingredients_by_id(id):
    logger.info("get_ingredients_by_id")


# returns tags for specific recipe ID
def get_tags_by_id(id):
    logger.info("get_tags_by_id")


# Front-end entry points

# list of recipes
def index():
    logger.info("index")
    return dict(recipes = get_recipes())

# specific recipe
# will get tags, ingredients, etc. and return everything
# expected format of /recipe/id
def recipe():
    logger.info("recipe")
    logger.info(request.args)

    recipe_id = 0 
    
    if request.args(0) is None:
        redirect(URL('default', 'index'))

    recipe_id = request.args(0)

    # get_recipe_by_id
    # populate ingredients
    # populate tags
    # create JSON

    return dict(recipe = get_recipe_by_id(recipe_id))



def user():
    """
    exposes:
    http://..../[app]/default/user/login
    http://..../[app]/default/user/logout
    http://..../[app]/default/user/register
    http://..../[app]/default/user/profile
    http://..../[app]/default/user/retrieve_password
    http://..../[app]/default/user/change_password
    http://..../[app]/default/user/bulk_register
    use @auth.requires_login()
        @auth.requires_membership('group name')
        @auth.requires_permission('read','table name',record_id)
    to decorate functions that need access control
    also notice there is http://..../[app]/appadmin/manage/auth to allow administrator to manage users
    """
    return dict(form=auth())


@cache.action()
def download():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    return response.download(request, db)


def call():
    """
    exposes services. for example:
    http://..../[app]/default/call/jsonrpc
    decorate with @services.jsonrpc the functions to expose
    supports xml, json, xmlrpc, jsonrpc, amfrpc, rss, csv
    """
    return service()
