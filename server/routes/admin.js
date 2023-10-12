const express = require('express');
const router = express.Router();
const User = require('../models/user');
const post = require('../models/post')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layout/admin';
const jwtSecret = process.env.JWT_SECRET;

/** check Login*/
const authMiddleware =(req, res, next)=>{
    const token = req.cookies.tokenCookie;
    if(!token){
        return res.status(401).json({message: 'Not Authorized'});
    }
    try{
        const decoded =jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).json({message: 'Not Authorized'});
    }
}




router.get('/admin', async(req,res)=>{
    try{
        res.render('admin/index',{layout: adminLayout})
    }
    catch(error){
            console.log(error)
    }
    });




router.post('/login', async(req,res)=>{
    
    try{
        const {username, password}= req.body;
        const user = await User.findOne({username: username });
        if(!user){
           return res.status(401).json({message:'User doesn\'t exit'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message:'Invalid credentials'});
        }

        const token = jwt.sign({userId: user._id}, jwtSecret);

        res.cookie('tokenCookie', token, {httpOnly: true});
        res.redirect('/dashboard');
    }
    catch(error){
        console.log(error);
    }
});  

router.post('/register', async(req,res)=>{
    try{
        const {username, password}= req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
       try{
        const user = await User.create({username: username, password: hashedPassword});
        res.status(201).json({message: 'User Created'});
    }
    catch(error){
        if(error.code === 11000){
            res.status(409).json({message: 'Username already exists'})
        }
        else{
            console.log(error);
            res.status(500).json({message: 'User not created. Internal Server Error, ple'});
        }

    }}
    catch(error){
        console.log(error);
    }
});

router.get('/dashboard',authMiddleware, async(req,res)=>{
    try{
        const data = await post.find().sort({createdAt: -1});
        
        res.render('admin/dashboard',{data, layout: adminLayout});
    }
    catch(error){   
        console.log(error);
    }   


})

router.get('/create',authMiddleware, async(req,res)=>{
    try{
        res.render('admin/create',{layout: adminLayout});

    }
    catch(error){
        console.log(error);
    }
})
router.post('/add', authMiddleware, async(req,res)=>{
    try{
        const {title, body}= req.body;
        if(post.create({title: title, body: body})){
            res.redirect('/dashboard');
        }
        else{
            res.status(500).json({message: 'Post not created. Internal Server Error, ple'});
        }
    }
    catch(error){
        console.log(error);
    }
}
)
router.get('/admin-post/:id',authMiddleware, async(req,res)=>{
    try{
        const data = await post.findById({_id: req.params.id});
        res.render('admin/post',{data, currentRoute:`/post/${req.params.id}`, layout: adminLayout});
    }
    catch(error){
        console.log(error)
    }
})

router.delete('/delete/:id', authMiddleware,async(req,res)=>{

    try{
        await post.findByIdAndDelete({_id: req.params.id});
     
        res.redirect('/dashboard');

    }catch(error){
        console.log(error)
    }
})

router.get('/edit-post/:id', authMiddleware, async(req,res)=>{
    try{
        const data = await post.findById({_id: req.params.id});
        res.render('admin/edit-post',{data,layout: adminLayout});
    }catch(error){
        console.log(error)
    }
})

router.put('/edit-post/:id', authMiddleware, async(req,res)=>{
    try{
         console.log("entered this route")
        // const blog = post.findById( req.params.id);
        // console.log(blog.title, blog.body);
        const temp =await post.findByIdAndUpdate({_id:req.params.id}, {title: req.body.title, body: req.body.body, updatedAt: Date.now()});
        await temp.save();
         res.redirect('/dashboard');
    }catch(error){
        console.log(error);
    }
    
})

router.get('/logout',authMiddleware, async(req,res)=>{
    try{    
        res.clearCookie('tokenCookie');
        res.redirect('/');

    }catch(error){
        console.log(error);
    }
})

module.exports= router;