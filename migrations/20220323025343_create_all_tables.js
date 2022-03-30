/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
 return knex.schema.createTable('users',table=>{
      table.bigIncrements('id');
      table.string('fname');
      table.string('lname');
      table.string('email');
      table.string('username').unique();
      table.string('password').unique();
      table.binary('media')
  })
  .createTable('post',table=>{
      table.bigIncrements('id');
      table.string('username');
      table.text('title');
      table.text('content');
      table.binary('media')
      table.foreign('username')
        .references('username')
        .inTable('users')
        .onDelete('cascade')
        .onUpdate('cascade');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return  knex.schema.dropTableIfExists('post').dropTableIfExists('users')
   
};
