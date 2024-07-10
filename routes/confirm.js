const express = require('express')
const router = express.Router()
const db = require('../db')

router.use(express.urlencoded({ extended: true }))

router.get('/', (req, res) => {
    const username = req.query.username
    const newPassword = req.query.newPassword

    res.render('confirm', { username: username, newPassword: newPassword, errorMessage: " " })
})

router.post('/', (req, res) => {
    const username = req.query.username
    const newPassword = req.query.newPassword
    const enteredCode = req.body.code

    //retrieving confirmation code from database 
    const query = `SELECT confirmation_code FROM users 
    WHERE username = "${username}"`

    db.query(query, (err, code) => {
        if (err) {
            console.error('Error executing query:', err.message)
            return res.status(500).send('Internal Server Error')
        }

        const confCode = code[0].confirmation_code

        if (enteredCode && confCode) {
            if (confCode === enteredCode) {

                // updating the password in the database 
                query2 = ` UPDATE users SET password = "${newPassword}" 
                WHERE username = "${username}"`
                db.query(query2, (err, result) => {
                    if (err) {
                        console.error('Query error:', err.message)
                        return res.status(500).send('Internal Server Error')
                    }
                })
                // redirecting to login page with passwordChanged set to 
                // true to display a 'password changed' message 
                res.redirect("/login?passwordChanged=true")
            } else {
                res.render('confirm', { username: username, newPassword: 
                    newPassword, errorMessage: "wrong confirmation code" })}
        } else {
            res.render('confirm', { username: username, newPassword:
                 newPassword, errorMessage: "enter confirmation code" }) }
    })
})

module.exports = router 