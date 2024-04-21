const express = require('express');
const mongoose = require('mongoose');
const Users = require('./models/Users.models'); //Users is a model/table(in sql)/collection(in mongoDB)
const QPapers = require('./models/QPapers.models'); //QPapers is a model/table(in sql)/collection(in mongoDB)
const Quizzes = require('./models/Quizzes.models');
const fs = require('fs');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());


// 1
//To get the password of the username entered, while trying to log in
app.get('/users/:username', async(req, res) => {
    const { username } = req.params;
    const requiredUser = await Users.findOne({username: username});
    
    if(requiredUser === null || (Array.isArray(requiredUser) && requiredUser.length() == 0))
        res.json(null)
    else
        res.json(requiredUser.password);
});

// 2
//To create a new user while trying to sign up
app.post('/users', async(req, res) => {
    //console.log(req.body)
    const newUser = await Users.create({firstName: req.body.firstName, username: req.body.username, password: req.body.password});
    
    res.json(newUser);
    
})

// 3
//To change the password
app.put('/users', async(req, res) => {
    //req contains the 1)username, whose password should be updated and the 2)updated password
    const user = await Users.findOne({username: req.body.username})
    user.password = req.body.password;
    await user.save();

    res.json(user);
})

// 4
//To delete a user
app.delete('/users', async(req, res) => {
    //req contains the username, who we wanna delete
    const deletedUser = await Users.findOneAndDelete({username: req.body.username})
    
    res.json(deletedUser);
})

// 5
//To delete all users
app.delete('/all/users', async(req, res) => {
    const deletedUsers = await Users.deleteMany({username: {$gte: ''}});
    
    res.json(deletedUsers);
})



// 1
//To upload a question paper(although not required in the front-end, just to store it in the collection)
app.post('/qpapers', async(req, res) => {
    const newQPaper = await QPapers.create({subject: 'Basic Electronics', type: 'late admission', year: '2022', 
        link: "https://drive.google.com/file/d/1A-LUM2tgKbm2wRKI2SbCEMRC_wUfLI1f/preview"});

    res.json(newQPaper);
})

//2
//my get method (using 'PUT', instead of 'GET', 
//becuase 'GET' only allows you to send data at the end of the URL,
//but sensetive data is involved and cannot be sent at the end of my URL)
app.put('/qpapers', async(req, res) => {
    let questionPapers;
    if(req.body.year == "" && req.body.type == "")
        questionPapers = await QPapers.find({subject: req.body.subject});
    else if(req.body.year != "" && req.body.type == "")
        questionPapers = await QPapers.find({subject: req.body.subject, year: req.body.year});
    else if(req.body.year == "" && req.body.type != "")
        questionPapers = await QPapers.find({subject: req.body.subject, type: req.body.type});
    else
        questionPapers = await QPapers.find({subject: req.body.subject, year: req.body.year, 
                                                                        type: req.body.type});



    const entities = [];
    questionPapers.forEach((questionPaper) => entities.push({
        year: questionPaper.year,
        type: questionPaper.type,
        link: questionPaper.link
    }))
   
    res.json(entities);
})


app.post('/quizzes', async(req, res) => {
    const quiz = await Quizzes.create({subject: 'Basic Mechanical Engineering', contents: [
        {
            question: 'lorem ipsum whatever 1',
            answers: ['option 1', 'option 2', 'option 3', 'option 4'],
            correctAnswer: 'option 3'
        },
        {
            question: 'lorem ipsum whatever 2',
            answers: ['option 1', 'option 2', 'option 3', 'option 4'],
            correctAnswer: 'option 1'
        },
        {
            question: 'lorem ipsum whatever 3',
            answers: ['option 1', 'option 2', 'option 3', 'option 4'],
            correctAnswer: 'option 4'
        },
        {
            question: 'lorem ipsum whatever 4',
            answers: ['option 1', 'option 2', 'option 3', 'option 4'],
            correctAnswer: 'option 1'
        },
        {
            question: 'lorem ipsum whatever 5',
            answers: ['option 1', 'option 2', 'option 3', 'option 4'],
            correctAnswer: 'option 2'
        },
        {
            question: 'lorem ipsum whatever 6',
            answers: ['option 1', 'option 2', 'option 3', 'option 4'],
            correctAnswer: 'option 2'
        },
        {
            question: 'lorem ipsum whatever 7',
            answers: ['option 1', 'option 2', 'option 3', 'option 4'],
            correctAnswer: 'option 4'
        },
        {
            question: 'lorem ipsum whatever 8',
            answers: ['option 1', 'option 2', 'option 3', 'option 4'],
            correctAnswer: 'option 3'
        },
        {
            question: 'lorem ipsum whatever 9',
            answers: ['option 1', 'option 2', 'option 3', 'option 4'],
            correctAnswer: 'option 4'
        },
        {
            question: 'lorem ipsum whatever 10',
            answers: ['option 1', 'option 2', 'option 3', 'option 4'],
            correctAnswer: 'option 2'
        }
    ]})

    res.json(quiz);
})

app.get('/quizzes/:subjectTitle', async(req, res) => {
    const { subjectTitle } = req.params;
    const quiz = await Quizzes.findOne({subject: subjectTitle});

    res.json(quiz);
})





mongoose.connect('mongodb+srv://neelPhadke:w9Pt4CEp3jg3c97F@cluster0.puocqd9.mongodb.net/acadBlvdDB?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    console.log("Database connected");
    app.listen(5000, () => console.log("The back-end server is live"));
})
.catch((err) => console.log("Database failed to connect", err.message))
