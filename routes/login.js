const express = require('express')
const router = express.Router()
const db = require('../db')


router.get('/', (req, res) => {
  const passwordChanged = req.query.passwordChanged === 'true'

  res.render('login', { errorMessage: '', passwordChanged: passwordChanged })
})

// initialising a tries variable to track the ammout of attempts at logging in
let tries = 0

router.post('/', async (req, res) => {
  const { username, password } = req.body

  // if the user enters incorrect password three times, they have to reset their password 
  if (tries >= 3) {
    tries = 0
    return res.redirect(`/passwordReset?username=${username}`)
  }

  // check if username and password are valid
  if (username && password) {
    const query = `SELECT * FROM users WHERE username = "${username}"`

    db.query(query, (err, data) => {
      if (err) {
        console.error('Error executing query:', err.message)
        return res.status(500).send('Internal Server Error')
      }

      if (data.length > 0) {
        for (let cnt = 0; cnt < data.length; cnt++) {
          if (data[cnt].password === password) {

            // checking whether the user is a student or a manager 
            if (data[cnt].role === 'student') {
              // redirecting to student home page 
              return res.redirect(`/studentHome?username=${encodeURIComponent(data[cnt].username)}`)
            } else if (data[cnt].role === 'manager') {
              // redirecting to manager home page
              return res.redirect(`/managerHome?username=${encodeURIComponent(data[cnt].username)}`)
            }
          }
        }

        // incrementing the tries variable if incorrect password 
        tries += 1

        // rendering the login page with an error if incorrect credentials 
        return res.render("login", { username: username, password: password, 
          errorMessage: 'wrong password', passwordChanged: false })
      } else {
        return res.render("login", { username: username, password: password,
           errorMessage: 'wrong username', passwordChanged: false })
      }
    })
  } else {

    // rendering the login page with an error if missing credentials 
    return res.render("login", { errorMessage: 'enter username and password', passwordChanged: false })
  }

})

module.exports = router
