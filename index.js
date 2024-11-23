const express = require('express');
const app = express();
const axios = require('axios');
app.use(express.json());
require('dotenv').config();
app.get('/images/random',async(req,res)=>{
    const image = await axios.get(`https://api.unsplash.com/photos/random?client_id=${process.env.apikey}`);
    console.log(image);
    
    const obj = {
        status: true,
        id: image.data.id,
        urls: image.data.urls,
        created_at: image.data.created_at,
        updated_at: image.data.updated_at,
        color: image.data.color
    }
    res.json(obj);
})

app.get('/images', async(req, res) => {
    let images;
    if(Object.entries(req.query).length) {
        if(req.query.page && !req.query.per_page) {
             images = await axios.get(`https://api.unsplash.com/photos/?page=${req.query.page}&per_page=20&client_id=${process.env.apikey}`);
        }
        else if(req.query.page && req.query.per_page){
             images = await axios.get(`https://api.unsplash.com/photos/?page=${req.query.page}&per_page=${req.query.per_page}&client_id=${process.env.apikey}`);
        }
    }
    else {
         images = await axios.get(`https://api.unsplash.com/photos/?per_page=20&client_id=${process.env.apikey}`);
    }
    res.json({
        status: true,
        total_results: images.headers['x-total'],
        images: images.data,  
    })
})

app.post('/images/search', async(req, res) => {
    const query = req.body.query;
    const images = await axios.get(`https://api.unsplash.com/search/collections?query=${query}&client_id=${process.env.apikey}`);
    res.json({
        status: true,
        total: images.data.total,
        total_pages: images.data.total_pages,
        images: images.data.results,  
    });
})

app.use('*',(req,res)=>{
    res.status(404).json({
        status: false,
        message: 'Page not found'
    });
})

app.listen(process.env.port, ()=>{
    console.log(`Server is running on ${process.env.endpoint}`);
})