const express = require('express');
const router = express.Router();
const post = require('../models/post');

router.get('/', async(req,res)=>{

    try{
        const locals={
            title: 'Wanda\'s blog',
            description: 'Daily gossip from your favorite witch'
        }

        //find all mongoose entries and return array
        let perPage = 8;
        let page = req.query.page || 1;


        
        const data = await post.find().sort({createdAt: -1}).skip(perPage * page - perPage).limit(perPage);

        const count = await post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);




        res.render('index', { data,
            locals,
            current: page,
            nextPage:hasNextPage?nextPage:null,
            currentRoute:''
        });


    }catch(error){
        console.log(error)
    }



    

})
router.get('/post/:id', async(req,res)=>{
    try{
        const data = await post.findById({_id: req.params.id});
        res.render('post',{data, currentRoute:`/post/${req.params.id}`});
    }
    catch(error){
        console.log(error)
    }

})

router.post('/search', async(req,res)=>{
    try{

        let searchTerm= req.body.searchTerm;
        console.log(searchTerm);
        
        const data = await post.find({
            $or: [
                {title:{$regex: searchTerm, $options: 'i'}},
                {body:{$regex: searchTerm, $options: 'i'}}
            ]
            });
            
        console.log(typeof(data));
        // const data = await post.findById({_id: req.params.id});
        res.render('search',{data});

    }
    catch(error){
        console.log(error)
    }

})




function insert(){
   
    post.insertMany([
        {
            title: "The day vision died",
            body:"Vision died the same day thanos made the snap. I killed him. It was either that or watch the world end. Had I known, I would've watched the world burn"+
            "I would've set it on fire myself. Minutes after I killed him, I watched thanos use the time stone and bring him back to life. Only to kill him again"
        },
        {   
            title:"The day Pietro died",
            body:"Pietro was my brother. He died on the hands of Ultron. I blame myself. We used to work for Ultron to avenge what happened to my parents. I only realized too late that his intention was to kill all human life."

        }
    ])
    console.log("data entered");
    
}








router.get('/about', (req,res)=>{ 
    res.render('about');
})
module.exports= router;