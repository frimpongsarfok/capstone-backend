var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'development']);


// await because user login is needed before other transaction will be proceed
  const login=(username,password)=>{

  //get username
  //if found compare password 
  //   if password match response status 200
  //   else resp status  404 msg incorrect password
  //else username not found respond 
//      404 msg username not exist
  //

  return new Promise((resolve,reject)=>{
   if(!username||!password){
    return reject({status:401,msg:'username and password required'});
   }else{
    return  knex('users').where({username:username}).then(rows=>{
        if(rows.length){
          bcrypt.compare(password, rows[0].password)
          .then((result)=>{
            const user={...rows[0]}
            console.log(result);
            user.password=password;
            result? resolve(user):reject({status:404,msg:'password incorrect'})        
         })
        }else{
            return reject({status:404,msg:"user name not found"})
        }

      })
   }
  });

}

//LOGOUT
router.get('/logout', function(req, res, next) {
   
  res.clearCookie('username').clearCookie('password')
   .header('Access-Control-Allow-Origin','http://localhost:3001')
   .header('Access-Control-Allow-Credentials', true).status(200).json({msg:'logout successful'})
});



///LOGIN
router.get('/login', function(req, res, next) {
  res.header('Access-Control-Allow-Origin','http://localhost:3001')
  .header('Access-Control-Allow-Credentials', true)
  const {username,password}=req.query;

   login(username,password).then(user=>{
    
        res
        .clearCookie('username')
        .clearCookie('password')
        .cookie('username',user.username)
        .cookie('password',user.password).status(200).json(user);
   }).catch(err=>res.status(404).json(err))
  
});
  
      //res.status(200).json({status:200,msg:'successful'})
  //     :
  //     res.status(200).json({status:200,msg:'username or password incorrect'});
  
// });

// //SIGN UP USER
// //salt&hash password before stored in db
router.post('/signup', function(req, res, next) {
  res.header('Access-Control-Allow-Origin','http://localhost:3001')
  .header('Access-Control-Allow-Credentials', true)
  const {fname,lname,email,username,password}=req.body;
  if(!fname||!lname||!email||!username||!password){
      res.status(401).json({status:401,msg:'all field required (firt name,last name,email,username,password)'})
      return;
  }
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      const  query={...req.body};
      query.password=hash;
      knex('users').insert(query)
      .then(rows=>res.status(200)
      .cookie('username',username)
      .cookie('password',password)
      .json(query))
      .catch(err=>res(401).json(err));
    });
  });
})
/ //SIGN UP USER
// //salt&hash password before stored in db
router.put('/user', function(req, res, next) {
  res.header('Access-Control-Allow-Origin','http://localhost:3001')
  .header('Access-Control-Allow-Credentials', true)
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({status:404,msg:'login required'})
    return;
  }
  const {fname,lname,email,new_username,new_password,displayImage}=req.body;
  
  if(!fname&&!lname&&!email&&!new_username&&!new_password &&!displayImage){
      res.status(401).json({status:401,msg:'one of the field required (firt name,last name,email,username,password, display picture) '})
      return;
  }

 
    let query={fname:fname,lname:lname,email:email}
  if(new_username){
    query.username=new_username;
  }
  if(new_password){
    query.password=new_password;
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(new_password, salt, function(err, hash) {
        query.password=hash;
        knex('users').update(query).where({username:username})
        .then(rows=>res.status(201)
        .cookie('username',new_username?new_username:new_username)
        .cookie('password',hash)
        .json({msg:'profile updated successful'}))
        .catch(err=>res.status(401).json(err));
      });
    })
  }else{
        knex('users').update(query).where({username:username})
        .then(rows=>res.status(201)

        .cookie('username',new_username?new_username:new_username)
        .cookie('password',password)
        .json({msg:'profile updated successful'}))
        .catch(err=>res.status(401).json(err));
  }
  
  
  
})
// GET 50 POST CONTENT AT A TIME
//if USER ID PROVIDED SELECT UP USER POST 
router.get('/post', function(req, res, next) {

  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({status:404,msg:'login required'})
    return;
  }

  const {mypost,last_range_id}=req.query;
   const lastID=parseInt(last_range_id)+0;
  if(last_range_id && mypost){
    knex('post').whereBetween('id',[lastID,lastID+50]).andWhere({username:username})
    .then(rows=>res.status(200).json(rows))
    .catch(err=>res.status(404).json(err))
  }else {
    knex('post').whereBetween('id',[lastID,lastID+50])
    .then(rows=>res.status(200).json(rows))
    .catch(err=>res.status(404).json(err))
  }
  
});
router.post('/post', function(req, res, next) {

  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({status:404,msg:'login required'})
    return;
  }
  const {title,content,media}=req.body;
  if(!title || !content){
    res.status(401).json({status:401,msg:'field required (e.i title,content) ,optional media eg. picture'})
    return;
}
  const query={...req.body}
  query.username=username;
  console.log(query);
  knex('post').insert(query)
    .then(rows=>res.status(200).json({msg:'posted successful'}))
    .catch(err=>console.log(err))//res.status(401).json(err));
});

// UPDATE POST WITH PUT METHOD
router.put('/post', function(req, res, next) {
  
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({msg:'login required'})
    return;
  }
  const {post_id,title,content,media}=req.body;
  if(!post_id&&!title&&!content){
      res.status(401).json({status:401,msg:'field required (e.i title,content) ,optional media'})
      return;
  }
  const query={...req.body};
  const id=query.post_id;
  delete query.post_id;
  console.log(query,id,username);

  knex('post').update(query).where({username:username,id:id})
      .then(status=>res.status(201).json({msg:'updated successful'}))
      .catch(err=>res.status(201).json(err));

});
// // UPDATE POST WITH PATCH METHOD
// router.patch('/post', function(req, res, next) {
//   console.log(req.query);
//   const {username,password}=req.cookies;
//   if(!username||!password){
//     res.status(404).json({status:404,msg:'login required'})
//     return;
//   }
//   const {post_id,title,content,media}=req.query;
//   if(!post_id &&!title&&!content && !media){
//     res.status(401).json({status:401,msg:'field required (e.i title or content or media) ,optional media'})
//     return;
//  }
//  const query={...req.query};
//  const id=query.post_id;
//  delete query.post_id;
//   if(title){
  
//     knex('post').where({username:username,id:id}).update(query)
//         .then(rows=>res.status(201).json({msg:'updated successful'}))
//         .catch(res.status(201).json(err));
//   }
//   if(content){
//     knex('post').where({username:username,id:id}).update(query)
//         .then(rows=>res.status(201).json({msg:'updated successful'}))
//         .catch(res.status(201).json(err));
//   }
//   if(media){
//     knex('post').where({username:username,id:id}).update(query)
//     .then(rows=>res.status(201).json({msg:'updated successful'}))
//     .catch(res.status(201).json(err));
//   }

// });
//DELETE POST
router.delete('/post', function(req, res, next) {
  console.log(req.query);
  const {username,password}=req.cookies;
  if(!username||!password){
    res.status(404).json({status:404,msg:'login required'})
    return;
  }
  const {post_id}=req.query;
  if(!post_id){
    res.status(401).json({status:401,msg:'post id required  '})
    return;
}
  knex('post').where({username:username,id:post_id}).del()
    .then(rows=>res.status(200).json({msg:'post deleted successful'}))
    .catch(err=>res.status(401).json(err));
});
module.exports = router;
