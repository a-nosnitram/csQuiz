const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    const username = req.query.username
    const score = req.query.score
    const maxScore = req.query.score
    const incorrectQuestions = JSON.parse(req.query.incorrectQuestions)
    
    // rendering the result page and displaying the obtained score 
    res.render('result', { username: username, score: score, maxScore: maxScore, incorrectQuestions: incorrectQuestions });
});

router.post('/', (req, res) => {
    const username = req.query.username

    // sending user back to their home page 
    res.redirect(`/studentHome?username=${encodeURIComponent(username)}`)
})

module.exports = router
