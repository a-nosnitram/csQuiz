const express = require('express')
const router = express.Router()

const db = require('../db')

router.get('/', (req, res) => {
    const username = req.query.username

    // retrieving the student's overall score from the database
    const query = `SELECT score FROM users WHERE username = "${username}"`

    db.query(query, (err, data) => {
        if (err) {
            console.error('query err : ', err.message)
            return res.status(500).send('int server err')
        }

        // displaying the student's overall score 
        const score = data.length > 0 ? data[0].score : 0

        res.render('studentHome', { session: req.session, username: username, score: score })
    })
})

module.exports = router
