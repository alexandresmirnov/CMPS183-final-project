# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

db.define_table('recipes',
				Field('name', 'text', required = True),
				Field('image', 'upload'),
				Field('description', 'text'),
				Field('instr', 'text'),
				Field('prep_t', 'integer'),
				Field('cook_t', 'integer')
)

db.define_table('ingredients',
				Field('recipe_id', 'reference recipes'),


)

db.define_table('tags',
				Field('name'),

)


db.define_table('reviews',
				Field('recipe_id', 'reference recipes'),
				Field('written_by', 'reference auth_user'),
				Field('rating','integer'),
				Field('title','text'),
				Field('body','text')
)



# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
