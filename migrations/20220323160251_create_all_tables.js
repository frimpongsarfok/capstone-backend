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
         table.string('name');
         table.timestamps(true,true);
     }).
     createTable('users_projects', table => {
        table.increments('id');
         table.integer('users_id');
         table.integer('projects_id');
         table.integer('permission');
         table.foreign('users_id').references('id').inTable('users').onDelete('cascade')
         table.foreign('projects_id').references('id').inTable('projects').onDelete('cascade')
         
     }).

    

     createTable('products', table => {
        table.increments('id');
        table.string('name');
        table.boolean('completed');
        table.integer('projects_id');
        table.timestamps(true,true);
        table.foreign('projects_id').references('id').inTable('projects').onDelete('cascade')
     }).

     createTable('list', table => {
        table.increments('id');
        table.string('name')
        table.boolean('completed');
        table.integer('products_id');
        table.timestamps(true,true);
        table.foreign('products_id').references('id').inTable('products').onDelete('cascade')
     })
     .createTable('card', table => {
         table.increments('id');
        table.text('name');
        table.string('tags');
        table.integer('points_value');
        table.date('due_date')
        table.boolean('completed');
        table.integer('list_id');
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
 