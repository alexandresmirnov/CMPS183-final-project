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
				Field('instr', 'list:string'),
				Field('prep_time', 'integer'),
				Field('cook_time', 'integer'),
				Field('ingredients','list:string'),
				Field('tags','list:reference tags.name'),
				auth.signature
)

db.define_table('tags',
				Field('name', 'string'),
				Field('category1'),
				Field('category2')

)

db.define_table('reviews',
				Field('recipe_id', 'reference recipes'),
				Field('written_by', 'reference auth_user', default=auth.user_id),
				Field('rating','integer'),
				Field('title','text'),
				Field('body','text')
)

db.define_table('users',
                
)


# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
