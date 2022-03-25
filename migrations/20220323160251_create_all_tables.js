/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
  

     .createTable('users', table => {
         table.increments('id');
        table.string('username').unique()
        table.string('password').unique();
        table.string('fname');
        table.string('lname');
        table.string('email');
    }).
    createTable('projects', table => {
        table.increments('id');
         table.string('name').notNullable();
         table.timestamps(true,true);
     }).
     createTable('users_projects', table => {
        table.increments('id');
         table.integer('user_id').notNullable();
         table.integer('project_id').notNullable();
         table.integer('permission').notNullable();
         table.foreign('user_id').references('id').inTable('users').onDelete('cascade')
         table.foreign('project_id').references('id').inTable('projects').onDelete('cascade')
         
     }).

    

     createTable('products', table => {
        table.increments('id');
        table.string('name').notNullable();
        table.boolean('completed').defaultTo(false);
        table.integer('project_id').notNullable();
        table.timestamps(true,true);
        table.foreign('project_id').references('id').inTable('projects').onDelete('cascade')
     }).

     createTable('list', table => {
        table.increments('id');
        table.string('name').notNullable();
        table.boolean('completed').defaultTo(false);
        table.integer('product_id').notNullable();;
        table.timestamps(true,true);
        table.foreign('product_id').references('id').inTable('products').onDelete('cascade')
     })
     .createTable('card', table => {
         table.increments('id');
        table.text('name').notNullable();
        table.string('tags');
        table.integer('points_value');
        table.date('due_date')
        table.boolean('completed').defaultTo(false);
        table.integer('list_id').notNullable();
        table.foreign('list_id').references('id').inTable('list').onDelete('cascade')
        table.timestamps(true,true);
    })
  
 
 };    
 
 /**
  * @param { import("knex").Knex } knex
  * @returns { Promise<void> }
  */
 exports.down = function(knex) {
     return knex.schema
     .dropTableIfExists('card')
     .dropTableIfExists('list')
     .dropTableIfExists('products')
     .dropTableIfExists('users_projects')
     .dropTableIfExists('projects')
     .dropTableIfExists('users');
     
 };
 