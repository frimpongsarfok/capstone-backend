const { round } = require('cli-boxes');
var express = require('express');
const url=require('url')
var router = express.Router();
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'development']);

/* GET home page. */
router.get('/users', function(req, res, next) {
 
  const {username,password}=req.cookies;
  console.log(username);
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }
   const {id}=req.query;
    id?knex('users').where({id:id}).then(rows=>{
      res.status(200).json(rows);
   }).catch(err=>res.status(400).send(err)):
    knex('users').then(rows=>{
       res.status(200).json(rows);
    }).catch(err=>res.status(400).send(err));
  
});

router.get('/logout', function(req, res, next) {
   
   res.clearCookie('username').clearCookie('password').
    status(200).json({msg:'logout successful'})
});

router.get('/login', function(req, res, next) {
   
  if(!req.query.username|| !req.query.password){
     res.status(400).json({msg:'provide username and password'});
     return;
  }

  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader( 'Content-Type','application/json');


 knex('users').where(req.query).then(rows=>{
        
  console.log(rows)
      if(!rows.length){
        res.status(404).json({msg:'user not found'})
      }else{
           
            res.cookie('username',rows[0].username).
              cookie('password',rows[0].password).
              status(200).json(rows[0]);

      }

     
 }).catch(err=>res.status(400).json(err));

});


router.get('/users/:command', function(req, res, next) {
  const {username,password}=req.cookies;
 
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }
  
  const {command}=req.params;
 

  // switch(command){
  //   case 'products' :{
  //     knex.schema.raw(`SELECT products.id,
  //                       products.title,
  //                       products.created_at,
  //                       products.updated_at
  //                   FROM products join users_products 
  //                   ON (products.id=users_products.product_id)  
  //                   JOIN users 
  //                   ON (users.id=users_products.user_id) where users.username='${username}';`).then(select=>res.json(select.rows))
                   
  //   }break;
  //   case 'tasks':{
  //     knex.schema.raw(`SELECT tasks.id,
  //         tasks.title,
  //         tasks.status,
  //         tasks.tags
  //     FROM tasks join users_tasks 
  //     ON (tasks.id=users_tasks.task_id)  
  //     JOIN users 
  //     ON (users.id=users_tasks.user_id) where users.username='${username}';`).then(select=>res.json(select.rows))
   
  //   }break;
  //   default:{
  //      res.status(400).json({status:400,err:'incorrect request'});
  //   }
  // }

 

});
router.get('/products', function(req, res, next) {
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }

  const {id,}=req.query;

  id?knex('products').where({id:id}).then(rows=>{
    res.status(200).json(rows);
 }).catch(err=>res.status(400).send(err)):
  knex('products').then(rows=>{
     res.status(200).json(rows);
  }).catch(err=>res.status(400).send(err));
});




router.get('/tasks', function(req, res, next) {
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }

  const {product_id}=req.query;
  knex('tasks').where({product_id:product_id}).then(rows=>{
    res.status(200).json(rows);
 }).catch(err=>res.status(400).send(err));
});

/* POST */


router.post('/signup', function(req, res, next) {
  knex('login').insert(req.query).then(select=>{
    res.status(201).json({status:201,msg:'Added Successful'});
 }).catch(err=>res.json(err));
});

router.post('/users', function(req, res, next) {
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }

  knex('users').insert(req.query).then(select=>{
    res.status(201).json({status:201,msg:'Added Successful'});
 }).catch(err=>res.json(err));
});


router.post('/products', function(req, res, next) {
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }

  knex('products').insert(req.query).then(select=>{
    res.status(201).json({status:201,msg:'Added Successful'});
 }).catch(err=>res.json(err));
});

router.post('/card', function(req, res, next) {
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }

  knex('card').insert(req.query).then(select=>{
    res.status(201).json({status:201,msg:'Added Successful'});
 }).catch(err=>res.json(err));
});

router.patch('/card', function(req, res, next) {
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }
  knex('card').update(req.query).where({list_id:req.query.list_id}).then(rows=>{
    res.status(201).json({status:204,msg:'Update Successful'});
 }).catch(err=>res.json(err));
});

router.get('/card', function(req, res, next) {
  console.log(req.query);
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }

  const {list_id}=req.query;
  knex('card').where({list_id:list_id}).then(rows=>{
    res.status(200).json(rows);
 }).catch(err=>res.status(400).send(err));
});




/*knex.raw("select products.title,products.created_at,products.updated_at,users.id,users.fname,users.lname from products join users_products on (users_products.product_id=products.id) join users on (users.id=users_products.user_id);").then(select=>{
      let products=[];
      select.rows.forEach(product => {
        let tmpProduct=null;
        products.forEach(prod=>{
          if(prod.title===product.title){
            tmpProduct=prod;
          }
        });
       if(!tmpProduct){
           products.push({title:product.title,created_at:product.created_at,users:[{fname:product.fname,lname:product.lname}]});
       }else{
          tmpProduct.users.push({fname:product.fname,lname:product.lname});
       }     
    });
    res.json(products);
}); */
//SELECT products.id,products.title,products.created_at,products.updated_at  FROM products join users_products ON (products.id=users_products.product_id)  JOIN users ON (users.id=users_products.user_id) where users.id=1;
module.exports = router;
