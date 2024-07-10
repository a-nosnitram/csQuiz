const express = require('express')
const router = express.Router()
const db = require('../db')
const pdfMake = require('pdfmake');

router.use(express.urlencoded({ extended: true }))

router.get('/', (req, res) => {
    const username = req.query.username
    const errorMessage = req.query.errorMessage
    const question = req.query.question
    const option1 = req.query.option1
    const option2 = req.query.option2
    const option3 = req.query.option3
    const option4 = req.query.option4
    const message = req.query.message

    // getting the questions from the database to display question list as accordion 
    const getAllQuestionsQuery = `
        SELECT topic, GROUP_CONCAT(question_text SEPARATOR '<br>') AS questions
        FROM questions
        GROUP BY topic
        ORDER BY topic; `

    // get students to rak them by score 
    const getStudents = `
        SELECT username, score, quizHistory
        FROM users
        WHERE role = 'student'
        ORDER BY score DESC;`

    db.query(getAllQuestionsQuery, (err, topics) => {
        if (err) {
            console.error('Error fetching questions by topic:', err.message)
            return res.status(500).send('Internal Server Error')
        }

        // putting each questions in an array to display them separately 
        // on the managerHome
        topics.forEach(topic => {
            if (topic.questions) {
                topic.questions = topic.questions.split('<br>')
            } else {
                topic.questions = [] 
            }
        })

        db.query(getStudents, (err, students) => {
            if (err) {
                console.error('Error fetching students:', err.message)
                return res.status(500).send('Internal Server Error')
            }

            // render the managerHome with topics and students data
            res.render('managerHome', { message: message, username: username, 
                topics: topics, students: students, errorMessage: errorMessage, 
                option1: option1, option2: option2, option3: option3, 
                option4: option4, question: question})
        })
    })
})

router.post('/addQuestion',  (req, res) => {
    const { topic, question, points, option1, option2, option3, option4, correctOption } = req.body
    const username = req.query.username

    // checking if any required field is empty or equal to 'Select a Topic' or 'Select an Option'
    if (!topic || topic === 'Select a Topic' || !question || !points || !option1 || !option2 
    || !option3 || !option4 || !correctOption || correctOption === 'Select an Option') {
        const errorMessage = 'Please fill out all fields'
        return res.redirect(`/managerHome?username=${username}&errorMessage=${errorMessage}
        &question=${question}&option1=${option1}&option2=${option2}&option3=${option3}&
        option4=${option4}`) // Render the page with an error message
    }

    const correctOptionMap = {
        "option1": option1,
        "option2": option2,
        "option3": option3,
        "option4": option4
    }

    // assigning the correct option to its corresponding value
    correctOption2 = correctOptionMap[correctOption]

    const query = `INSERT INTO questions (topic, question_text, points, option1, option2, 
        option3, option4, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

    // insert question into the database
    db.query(query, [topic, question, points, option1, option2, option3, option4, correctOption2], 
        (err, result) => {
        if (err) {
            console.error('Error inserting question:', err.message)
            return res.status(500).send('Internal Server Error')
        }

        const successMessage = "Question added successfully !"
        res.redirect(`/managerHome?username=${username}&message=${successMessage}`)
    })
})

module.exports = router
