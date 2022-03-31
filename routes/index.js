const { round } = require('cli-boxes');
var express = require('express');
const url=require('url')
const bcrypt=require('bcrypt');
var router = express.Router();
const saltRounds=10;
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'development']);





//INVITE USER

router.get('/',(req,res)=>res.send('<h1  >Code-Talker API</h1>'))
router.post('/invite',(req,res)=>{
   //check if user is login
   const {username,password}=req.cookies;
   if(!username||!password){
    res.status(404).json({status:403,msg:'login required'})
    return;
  }
  const {new_user_permission, new_user_id, project_id}=req.query;
  
  if(!project_id || !new_user_id || !new_user_permission){
    res.status(404).json({status:404,msg:'fields required (new user id, permission, project id).'})
    return;
  }
  //check if param are provided
   //check if user is admin or super -admin
   knex.raw(`SELECT users_projects.permission as permission from users_projects 
            JOIN users on (users.id=users_projects.user_id) where users.username='${username}' and users_projects.project_id='${project_id}'`).then(msg=>{

        
    const {permission} = msg.rows[0];
    
    if(permission != 1&&permission != 2){
      res.status(404).json({status:403,msg:'access denied'})
      return;
    }
    
   
    knex('users_projects').insert({user_id:new_user_id, permission:new_user_permission, project_id:project_id}).then(status=>{
     res.json({status:201,msg:'Added Successful'});
   }).catch(err=>err.code==='23503'?res.json({msg:'user does not exist.'}):res.status(401).json(err))
     //   if true
     //      add new user invited to users_projects table
              // responed add or fail if user
   }).catch(err=>res.status(400).send(err));
 
});

//DELETE USER
router.delete('/remove_user_from_project',(req,res)=>{
  //check if user is login
  const {username,password}=req.cookies;
  if(!username||!password){
   res.status(404).json({status:403,msg:'login required'})
   return;
 }
 const {user_id, project_id}=req.query;
 
 if(!project_id || !user_id){
   res.status(404).json({status:404,msg:'fields required (new user id, project id).'})
   return;
 }
 //check if param are provided
  //check if user is admin or super -admin
  knex.raw(`SELECT users_projects.permission as permission from users_projects 
           JOIN users on (users.id=users_projects.user_id) where users.username='${username}' and users_projects.project_id='${project_id}'`).then(msg=>{

       
   const {permission} = msg.rows[0];
   
   if(permission != 1&&permission != 2){
     res.status(404).json({status:403,msg:'access denied'})
     return;
   }
   
  
   knex('users_projects').where({user_id:user_id, project_id:project_id}).del().then(status=>{
    res.json({status:201,msg:'Removed Successfully'});
  }).catch(err=>err.code==='23503'?res.json({msg:'user does not exist.'}):res.status(401).json(err))
    //   if true
    //      add new user invited to users_projects table
             // responed add or fail if user
  }).catch(err=>res.status(400).send(err));

});

//UPDATE PERMISSION
router.patch('/update_user_permission',(req,res)=>{
  //check if user is login
  const {username,password}=req.cookies;
  if(!username||!password){
   res.status(404).json({status:403,msg:'login required'})
   return;
 }
 const {user_id, project_id, new_permission}=req.query;
 
 if(!project_id || !user_id || !new_permission){
   res.status(404).json({status:404,msg:'fields required ( user id, project id, new permission).'})
   return;
 }
 //check if param are provided
  //check if user is admin or super -admin
  knex.raw(`SELECT users_projects.permission as permission from users_projects 
           JOIN users on (users.id=users_projects.user_id) where users.username='${username}' and users_projects.project_id='${project_id}'`).then(msg=>{

       

   if(!msg.rows.length){
    res.status(404).json({status:403,msg:'user does not exist'})
    return;
   }
   const {permission} = msg.rows[0];

   if((new_permission <permission) ||permission>=3 ){
     res.status(404).json({status:403,msg:'access denied'})
     return;
   }
   
  
   knex('users_projects').update({permission:new_permission}).where({user_id:user_id, project_id:project_id}).then(status=>{
    res.json({status:201,msg:'Permission Updated Successfully'});
  }).catch(err=>err.code==='23503'?res.json({msg:'user does not exist.'}):res.status(401).json(err))
    //   if true
    //      add new user invited to users_projects table
             // responed add or fail if user
  }).catch(err=>res.status(400).send(err));

});

//LOGIN CRUD
//Create Account
router.post('/signup', function(req, res, next) {

  const {password,username}=req.query;
  if(!password||!username){
      res.status(401).json({msg:'username and password required'})
    return ;
  }
  bcrypt.hash(password, saltRounds).then(function(hash) {
    const query={...req.query};
    query.password=hash;
    knex('users').insert(query).then(status=>{
      res.cookie('username',username)
      .cookie('password',password)
      .status(201)
      .json({status:201,msg:'Added Successful'});
   }).catch(err=>err.code==='23505'?res.status(401).json({msg:'user already exist'}):res.status(401).json(err))
 });
});


//Read | Login in Account
router.get('/login', function(req, res, next) {
  const {username,password}=req.query;
  console.log(username,password)
  res.header('Access-Control-Allow-Origin','http://localhost:3000')
  .header('Access-Control-Allow-Credentials', true)
  if(!username|| !password){
     res.status(400).json({msg:'provide username and password'});
     return;
  }




  knex('users').where({username:username}).then(rows=>{
        
    if(!rows.length){
      res.status(401).json({msg:'username not found'});
      return;
    }else{
      const pwd=rows[0].password;
      bcrypt.compare(password, pwd).then(function(result) {
        if(result){
          const user={...rows[0]};
          user.password=password;
          res.cookie('username',user.username).
          cookie('password',user.password).
          status(200).json(user);
        }else{
         
          res.status(400).json({msg:'hey password incorrect'});
        }
      });
       
    }
      if(!rows.length){
        res.status(404).json({msg:'user not found'})
      }else{
           
           

      }     
 }).catch(err=>res.status(400).json(err));

});

//UPDATE | Update User Account
router.put('/account', function(req, res, next) {
  const {username,password}=req.cookies;
  console.log(username);
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }
  const {new_password,new_username}=req.query;
  if(new_password){
    password=new_password;
  }
  const oldUsername=username;
  if(new_username){
    username=new_username;
  }
  
  bcrypt.hash(password, saltRounds).then(function(hash) {
    const query={...req.query};
    query.password=hash;
    knex('users').update(query).where({username:oldUsername}).then(status=>{

      res.clearCookie('username')
      .clearCookie('password')
      .cookie('username',username)
      .cookie('password',password)
      .status(201)
      .json({status:201,msg:'Updated Successful'});
   }).catch(err=>res.status(401).json(err))
 });
});

//DELETE | Delete Users
router.delete('/deleteAccount', function(req, res, next) {
  console.log(req.query);
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({status:404,msg:'login required'})
    return;
  }
  knex('users').where({username:username}).del()
    .then(rows=>res.status(200).json({msg:'Account deleted successful'}))
    .catch(err=>res.status(401).json(err));

  
});
//for seaching for users
router.get('/users', function(req, res, next) {
 
  const {username,password}=req.cookies;
  console.log(username);
  if(!username||!password){
    res.status(404).json({msg:'login required'})
    return;
  }
   const {user}=req.query;
  if(!username){
    res.status(404).json({status:404,msg:'username required'})
    return;
  }
    knex('users').where({username:user}).then(rows=>{
      if(!rows.length){
        res.status(404).json({msg:"user does not exist."});
        return;
      }
       const user={...rows[0]};
       delete user.password;
       res.status(200).json(user);  
   }).catch(err=>res.status(400).send(err))
  
  
});

router.get('/logout', function(req, res, next) {
   
   res.clearCookie('username').clearCookie('password').
    status(200).json({msg:'logout successful'})
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

//CRUD | PROJECT
//Create

router.post('/projects', function(req, res, next) {
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }

  knex('projects').insert(req.query).then(result=>{
    res.status(201).json({status:201,msg:'Added Successful'});
 }).catch(err=>res.status(401).json(err));
});


//Read
router.get('/projects', function(req, res, next) {
 
  const {username,password}=req.cookies;
  console.log(username);
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }    
    knex.raw(`
       SELECT projects.id,projects.created_at,projects.updated_at,projects.name,users_projects.permission  
       FROM projects 
       JOIN users_projects
        ON (projects.id=users_projects.project_id) 
        JOIN users 
        ON (users.id=users_projects.user_id) 
        where users.username='${username}';
    `).then(msg=>{
      res.status(200).json(msg.rows);
   }).catch(err=>res.status(400).send(err));
  
});

//update
router.patch('/projects', function(req, res, next) {

  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({status:404,msg:'login required'})
    return;
  }
  const {project_id,new_project_name}=req.query;
  if(!project_id ||!new_project_name){
    res.status(404).json({status:404,msg:'project id required'})
    return;
  }
  knex('projects').update({name:new_project_name}).where({id:project_id})
    .then(msg=>res.status(200).json({msg:'Project update successful'}))
    .catch(err=>res.status(401).json(err));

  
});
//delete
router.delete('/projects', function(req, res, next) {

  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({status:404,msg:'login required'})
    return;
  }
  const {project_id}=req.query;
  if(!project_id){
    res.status(404).json({status:404,msg:'project id required'})
    return;
  }
  knex('projects').where({id:project_id}).del()
    .then(rows=>res.status(200).json({msg:'Project deleted successful'}))
    .catch(err=>res.status(401).json(err));

  
});

//create products
router.post('/products', function(req, res, next) {
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }
  const {project_id,name}=req.query;
  if(!project_id || !name){
    res.status(404).json({status:404,msg:'fields required ( project ID, project name) id required'})
    return;
  }
  knex('products').insert(req.query).then(result=>{
    res.status(201).json({status:201,msg:'Added Successful'});
 }).catch(err=>res.status(401).json(err));
});

//Read products
router.get('/products', function(req, res, next) {
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }

  
  const {project_id}=req.query;
  if(!project_id){
    res.status(404).json({status:404,msg:'project ID required'})
    return;
  }

  knex('products').where({id:project_id}).then(rows=>{
    res.status(200).json(rows);
 }).catch(err=>res.status(401).send(err))
  });

//Update products

router.patch('/products', function(req, res, next) {

  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({status:404,msg:'login required'})
    return;
  }
  const {product_id,new_product_name}=req.query;
  if(!product_id ||!new_product_name){
    res.status(404).json({status:404,msg:'fields required (product ID , new product name)'})
    return;
  }
  knex('products').update({name:new_product_name}).where({id:product_id})
    .then(msg=>res.status(200).json({msg:'Product update successful'}))
    .catch(err=>res.status(401).json(err));

  
});

//delete products

router.delete('/products', function(req, res, next) {

  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({status:404,msg:'login required'})
    return;
  }
  const {product_id}=req.query;
  if(!product_id){
    res.status(404).json({status:404,msg:'product ID required'})
    return;
  }
  knex('products').where({id:product_id}).del()
    .then(rows=>res.status(200).json({msg:'Product deleted successful'}))
    .catch(err=>res.status(401).json(err));

  
});

//Create list

router.post('/list', function(req, res, next) {
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }
  const {product_id,name}=req.query;
  if(!product_id ||!name){
    res.status(404).json({status:404,msg:'field required  ( product ID ,  list name )'})
    return;
  }
  knex('list').insert(req.query).then(result=>{
    res.status(201).json({status:201,msg:'Added Successful'});
 }).catch(err=>res.status(401).json(err));
});

// read list

router.get('/list', function(req, res, next) {
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({msg:'hey login before!!!'})
    return;
  }

  
  const {product_id}=req.query;
  if(!product_id){
    res.status(404).json({status:404,msg:'product ID is required'})
    return;
  }

  knex('list').where({product_id:product_id}).then(rows=>{
    res.status(200).json(rows);
 }).catch(err=>res.status(401).send(err))
  });


  //Update list

  router.patch('/list', function(req, res, next) {

    const {username,password}=req.cookies;
    if(!username||!password){
      res.status(404).json({status:404,msg:'login required'})
      return;
    }
    const {list_id,new_list_name}=req.query;
    if(!list_id ||!new_list_name){
      res.status(404).json({status:404,msg:' field required ( list ID ,list name)'})
      return;
    }
    knex('list').update({name:new_list_name}).where({id:list_id})
      .then(msg=>res.status(200).json({msg:'list update successful'}))
      .catch(err=>res.status(401).json(err));
  
    
  });

  router.delete('/list', function(req, res, next) {

    const {username,password}=req.cookies;
    if(!username||!password){
      res.status(404).json({status:404,msg:'login required'})
      return;
    }
    const {list_id}=req.query;
    if(!list_id){
      res.status(404).json({status:404,msg:'list id required'})
      return;
    }
    knex('list').where({id:list_id}).del()
      .then(rows=>res.status(200).json({msg:'List deleted successful'}))
      .catch(err=>res.status(401).json(err));
  
    
  });

  //create card

  router.post('/card', function(req, res, next) {
    const {username,password}=req.cookies;
    if(!username||!password){
      res.status(404).json({msg:'hey login before!!!'})
      return;
    }
    const {list_id,name}=req.query;
    if(!list_id ||!name){
      res.status(404).json({status:404,msg:'field required  ( list id ,  card name )'})
      return;
    }
    knex('card').insert(req.query).then(result=>{
      res.status(201).json({status:201,msg:'Added Successful'});
   }).catch(err=>res.status(401).json(err));
  });
  
  // read card 

  router.get('/card', function(req, res, next) {
    const {username,password}=req.cookies;
    if(!username||!password){
      res.status(404).json({msg:'hey login before!!!'})
      return;
    }
  
    
    const {list_id}=req.query;
    if(!list_id){
      res.status(404).json({status:404,msg:'list id is required'})
      return;
    }
  
    knex('card').where({list_id:list_id}).then(rows=>{
      res.status(200).json(rows);
   }).catch(err=>res.status(401).send(err))
    });
  
    //Update card

  router.patch('/card', function(req, res, next) {

    const {username,password}=req.cookies;
    if(!username||!password){
      res.status(404).json({status:404,msg:'login required'})
      return;
    }
    const {card_id,new_card_name}=req.query;
    if(!card_id ||!new_card_name){
      res.status(404).json({status:404,msg:' field required ( card ID ,card name)'})
      return;
    }
    knex('card').update({name:new_card_name}).where({id:card_id})
      .then(msg=>res.status(200).json({msg:'list update successful'}))
      .catch(err=>res.status(401).json(err));
  
    
  });

  router.delete('/card', function(req, res, next) {

    const {username,password}=req.cookies;
    if(!username||!password){
      res.status(404).json({status:404,msg:'login required'})
      return;
    }
    const {card_id}=req.query;
    if(!card_id){
      res.status(404).json({status:404,msg:'card id required'})
      return;
    }
    knex('card').where({id:card_id}).del()
      .then(rows=>res.status(200).json({msg:'Card deleted successful'}))
      .catch(err=>res.status(401).json(err));
  
    
  });
// router.get('/tasks', function(req, res, next) {
//   const {username,password}=req.cookies;
//   if(!username||!password){
//     res.status(404).json({msg:'hey login before!!!'})
//     return;
//   }

//   const {product_id}=req.query;
//   knex('tasks').where({product_id:product_id}).then(rows=>{
//     res.status(200).json(rows);
//  }).catch(err=>res.status(400).send(err));
// });

// /* POST */



// router.post('/users', function(req, res, next) {
//   const {username,password}=req.cookies;
//   if(!username||!password){
//     res.status(404).json({msg:'hey login before!!!'})
//     return;
//   }

//   knex('users').insert(req.query).then(select=>{
//     res.status(201).json({status:201,msg:'Added Successful'});
//  }).catch(err=>res.status(401).json(err));
// });


// router.post('/products', function(req, res, next) {
//   const {username,password}=req.cookies;
//   if(!username||!password){
//     res.status(404).json({msg:'hey login before!!!'})
//     return;
//   }

//   knex('products').insert(req.query).then(msg=>{
//     res.status(201).json({status:201,msg:'Added Successful'});
//  }).catch(err=>res.status(401).json(err));
// });

// router.post('/card', function(req, res, next) {
//   const {username,password}=req.cookies;
//   if(!username||!password){
//     res.status(404).json({msg:'hey login before!!!'})
//     return;
//   }
 
//   knex('card').insert(req.query).then(msg=>{
//     res.status(201).json({status:201,msg:'Added Successful'});
//  }).catch(err=>res.status(401).json(err));
// });

// router.patch('/card', function(req, res, next) {
//   const {username,password}=req.cookies;
//   if(!username||!password){
//     res.status(404).json({msg:'hey login before!!!'})
//     return;
//   }
//   knex('card').update(req.query).where({list_id:req.query.list_id}).then(rows=>{
//     res.status(201).json({status:204,msg:'Update Successful'});
//  }).catch(err=>res.status(401).json(err));
// });

// router.get('/card', function(req, res, next) {
//   console.log(req.query);
//   const {username,password}=req.cookies;
//   if(!username||!password){
//     res.status(404).json({msg:'hey login before!!!'})
//     return;
//   }

//   const {list_id}=req.query;
//   knex('card').where({list_id:list_id}).then(rows=>{
//     res.status(200).json(rows);
//  }).catch(err=>res.status(401).send(err));
// });

// //LIST
// router.post('/list', function(req, res, next) {
//   const {username,password}=req.cookies;
//   if(!username||!password){
//     res.status(404).json({msg:'hey login before!!!'})
//     return;
//   }
 
//   knex('list').insert(req.query).then(msg=>{
//     res.status(201).json({status:201,msg:'Added Successful'});
//  }).catch(err=>res.status(401).json(err));
// });


// router.get('/list', function(req, res, next) {
//   console.log(req.query);
//   const {username,password}=req.cookies;
//   if(!username||!password){
//     res.status(404).json({msg:'hey login before!!!'})
//     return;
//   }

//   const {product_id}=req.query;
//   knex('list').where({product_id:product_id}).then(rows=>{
//     res.status(200).json(rows);
//  }).catch(err=>res.status(401).send(err));
// });

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



/*
bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
    // Store hash in your password DB.
});
bcrypt.compare(myPlaintextPassword, hash).then(function(result) {
    // result == true
});

*/

module.exports = router;