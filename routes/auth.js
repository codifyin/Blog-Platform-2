const express = require('express');
const auth = express.Router();
const bcrypt = require('bcrypt');
const user = require('../models/user');
const Article = require('../models/article');
const mongo = require('mongodb');

auth.get('/login', (req, res) => {
    res.render('login')
});

auth.get('/signup', (req, res) => {
    res.render('signup')
});

auth.post("/signup", async (req, res) => {
    const data = {
        username: req.body.username,
        password: req.body.password,
    }

    const existingUser = await user.findOne({username: data.username});
    if (existingUser) {
        res.send("User already exists. Change the username");
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

        const userData = await user.insertMany(data);
        res.redirect('/login')
        console.log(userData);
    }
});

auth.post("/login", async (req, res) => {
    try {
        const name = req.body.username;
        const check = await user.findOne({username: name});

        if (!check) {
            res.send('username cannot be found');
        } else {
            const passwordMatch = await bcrypt.compare(req.body.password, check.password);
        if (passwordMatch) {
            req.session.name = name;
            res.redirect(`/blogs`);
        } else {
            res.send("Wrong Password");
        }
        }
    } catch (error){
        console.log(error);
        res.send("wrong details");
    }
});



//blogs routes
auth.get('/blogs', async (req, res) => {
    const articles = await Article.find({});
    // res.json(articles);
    res.render('index', {nameInput: req.session.name, articles: articles});
});

auth.get('/blogs/:id', async (req, res) => {
    try {
        const id = new mongo.ObjectId(req.params.id);
        const aaaa = await Article.find({_id: id});
        res.status(200).json({
            status: 'success',
            data: aaaa
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

auth.get('/edit/:id', async (req, res) => {
    try {
        const id = new mongo.ObjectId(req.params.id);
        const article = await Article.findOne({_id: id});
        res.render('edit', {article: article});
    } catch (error) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

auth.get('/new', (req, res) => {
    res.render('new');
});

auth.post('/new', async (req, res) => {
    const data = {
        title: req.body.title,
        content: req.body.content,
        author: req.session.name,
        createdAt: new Date()
    };
    await Article.create(data);
    res.redirect('/blogs');
});

auth.put('/blogs/:id', async (req, res) => {
    try {
        const id = new mongo.ObjectId(req.params.id);
        const article = await Article.find({_id: id});
        var updatedArticle;
        if (!article) {
            return res.status(404).json({
                status: 'fail',
                message: 'Article not found'
            });
        } else {
            await Article.updateOne({_id: id}, {$set: {content: req.body.content}});
            updatedArticle = await Article.findOne({_id: id});
        }
        // {
        //     "content": "what the hell is going on?"
        // }
        // res.status(200).json({
        //     status: 'success',
        //     data: {
        //         article: updatedArticle
        //     }
        // });

        res.redirect('/blogs');
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});


auth.delete('/blogs/:id', async (req, res) => {
    const id = new mongo.ObjectId(req.params.id);
    const data = await Article.find({_id: id});
    if (!data || data.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    await Article.deleteOne({_id: id});

    res.redirect('/blogs');
});




module.exports = auth;