const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    const locals={
        title: 'Delulu life',
        description: 'Delulu life is a blog about delulu life'
    }
    res.render('index', {locals});

})
router.get('/about', (req,res)=>{
    res.render('about');
})
module.exports= router;