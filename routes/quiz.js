const express = require('express')
const router = express.Router()
const db = require('../db')
const he = require('he');


router.get('/', (req, res) => {
  const topic = req.query.topic

  const query = `SELECT * FROM questions WHERE topic = "${topic}" ORDER BY RAND() LIMIT 10`

  db.query(query, (err, questions) => {
    if (err) {
      console.error('Query error:', err.message)
      return res.status(500).send('Internal Server Error')
    }

    res.render('quiz', { username: req.query.username, topic: topic, questions: questions })
  })
})

router.post('/submit', (req, res) => {
  const answers = req.body.answers.map(answer => he.decode(answer))
  const ids = req.body.ids
  const username = req.query.username

  let score = 0
  let maxScore = 0
  let incorrectQuestions = []

  // counter to keep track of the number of questions processed
  let count = 0

  for (let i = 0; i < 10; i++) {
    const query = `SELECT * FROM questions WHERE id_questions = "${ids[i]}"`

    db.query(query, (err, theQuestion) => {
      if (err) {
        console.error('Query error:', err.message)
        return res.status(500).send('Internal Server Error')
      }

      // incrementing the maximum score for the quiz for the final grade
      maxScore += theQuestion[0].points

      // calculate the score
      if (theQuestion[0].correct_option === answers[i]) {
        score += theQuestion[0].points;
      } else {
        incorrectQuestions.push({
          question: theQuestion[0].question_text,
          correctAnswer: theQuestion[0].correct_option,
          userAnswer: answers[i]
        })
      }

      // check if all questions have been processed
      count++
      if (count === 10) {
        // updating the student's overall score in the database
        const updateScore = `UPDATE users SET score = score + ${score} WHERE username = "${username}"`
        db.query(updateScore, (err, result) => {
          if (err) {
            console.error('Query error:', err.message)
            return res.status(500).send('Internal Server Error')
          }
        })

        // update quiz history
        const quizHistory = {
          date: new Date().toISOString().split('T')[0],
          topic: theQuestion[0].topic,
          score: score,
          maxScore: maxScore
        }

        const updateHistory = `
          UPDATE users
          SET quizHistory = JSON_ARRAY_APPEND(quizHistory, '$', '${JSON.stringify(quizHistory)}')
          WHERE username = '${username}'`

        db.query(updateHistory, (err, result) => {
          if (err) {
            console.error('Query error:', err.message);
            return res.status(500).send('Internal Server Error')
          }

          // rendering the result page with the necessary data
          res.redirect(`/result?username=${encodeURIComponent(username)}&score=
          ${score}/${maxScore}&incorrectQuestions=${JSON.stringify(incorrectQuestions)}`)
        })
      }
    })
  }
})

module.exports = router
