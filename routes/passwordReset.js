const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer');
const db = require('../db')

router.use(bodyParser.urlencoded({ extended: true }))

// generate confirmation code
function generateCode() {
    const min = 100000
    const max = 999999
    return Math.floor(Math.random() * (max - min + 1)) + min
}

router.get('/', (req, res) => {
    const username = req.query.username

    res.render('passwordReset', { username: username, errorMessage: " " })
})

router.post('/', async (req, res) => {
    const { username, newPassword, newPassword2 } = req.body

    // defining the range of values for the new password (at least 8 characters, among which 1 letter, 1 special character, and 1 number)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

    // check if all required values are acquired  
    if (username && newPassword && newPassword2) {
        // checking if new password corresponds to password policy; send an error message otherwise 
        if (!passwordRegex.test(newPassword)) {
            return res.render("passwordReset",
                {
                    username: username, errorMessage:
                    'Password must be at least 8 characters long, and contain at least one letter, one number, and one special character.'
                })
        }
        // check if the password is confirmed 
        if (newPassword === newPassword2) {
            const query = `SELECT * FROM users WHERE username = "${username}"`

            db.query(query, (err, data) => {
                if (err) {
                    console.error('Error executing query:', err.message)
                    return res.status(500).send('Internal Server Error')
                }

                // retrieving the user's email from the database 
                const email = data[0].email
                // generating a confirmation code 
                const confirmationCode = generateCode()
                // saving the c1omnfirmation code in the database for future comparisons 
                const saveCode = `UPDATE users SET confirmation_code = "${confirmationCode}" 
                WHERE username = "${username}"`

                db.query(saveCode, (err, result) => {
                    if (err) {
                        console.error('Error executing query:', err.message)
                        return res.status(500).send('Internal Server Error')
                    }

                    const transporter = nodemailer.createTransport(({
                        // configuring for gmail :
                        service: 'gmail',

                        auth: {
                            // you have to fill in your gmail login information for this to work 
                            // your google account has to have "less secure apps" enabled 
                            // and you need to have 2FA turned off 
                            user: 'youremail@gmail.com',
                            pass: 'your password'
                        }
                    }))

                    // configuring the email 
                    const mailOptions = {
                        from: 'youremail@gmail.com',
                        to: email,
                        subject: 'Password Reset Confirmation Code',
                        text: `Your confirmation code for password reset is: ${confirmationCode}`
                    }

                    // sending a confirmation email 
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('Error sending email:', error)
                            return res.status(500).send('Internal Server Error')
                        }

                        // redirecting to the confirmation page to enter the confirmation code
                        return res.redirect(`/confirm?username=${encodeURIComponent(username)}&
                        newPassword=${encodeURIComponent(newPassword)}`)
                    })
                })
            })

        } else {
            return res.render("passwordReset", { errorMessage: 'the password confirmation has to match your new password', username: username, newPassword: newPassword })
        }

    } else {
        return res.render("passwordReset", { errorMessage: 'enter your new password', username: username, newPassword: newPassword })
    }
})

module.exports = router 