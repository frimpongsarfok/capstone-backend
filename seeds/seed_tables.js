const bcrypt=require('bcrypt')
/**
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries

  const password='password'
   let new_password=null;
 const saltRounds=10;
   bcrypt.hash(password, saltRounds, function(err, hash) {
  err?console.log(err):new_password=hash;
  });

  await knex('users').del()
  await knex('users').insert([
    { username: 'username',password: new_password,fname: 'Rocco',lname: 'Patrick',email: 'rocco@rpatrick.com'}
  ]);
  
  await knex('projects').del()
  await knex('projects').insert([
    { name: 'Army Dashboard'},
  ]);

  await knex('users_projects').del()
  await knex('users_projects').insert([
    { user_id:1,project_id:1, permission: 1},
  ]);

  await knex('products').del()
  await knex('products').insert([
    { name: 'Training Calender',completed: true,project_id: 1},
  ]);

  await knex('list').del()
  await knex('list').insert([
    {name:'Todo', completed: false,product_id: 1},
    {name:'Doing', completed: false, product_id: 1},
    {name:'Done',completed: false, product_id: 1},
  ]);
  
  await knex('card').del()
  await knex('card').insert([
    { name: 'Live Fire', tags: 'Range 40', points_value: 1, due_date: new Date(), completed: false, list_id: 1}
  ]);
};
