
/**
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    { username: 'username',password: 'password',fname: 'Rocco',lname: 'Patrick',email: 'rocco@rpatrick.com'}
  ]);

  await knex('projects').del()
  await knex('projects').insert([
    { name: 'Army Dashboard'},
  ]);

  await knex('users_projects').del()
  await knex('users_projects').insert([
    { users_id:1,projects_id:1, permission: 1},
  ]);

  await knex('products').del()
  await knex('products').insert([
    { name: 'Training Calender',completed: true,projects_id: 1},
  ]);

  await knex('list').del()
  await knex('list').insert([
    {name:'Todo', completed: false,products_id: 1,name:'Doing', completed: false, products_id: 1,name:'Done',completed: false, products_id: 1},
  ]);
  
  await knex('card').del()
  await knex('card').insert([
    { name: 'Live Fire', tags: 'Range 40', points_value: 1, due_date: new Date(), completed: false, list_id: 1}
  ]);
};
