# csQuiz

csQuiz is a web-based quiz application designed to help students and managers interact with quizzes and track performance.

## Getting Started

### Prerequisites

Ensure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/a-nosnitram/csQuiz/
    ```
2. Navigate to the project directory:
    ```sh
    cd csQuiz
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

### Running the Application

To start the program, run the following command in the console:

```sh
npm run startprog
```

The application will be available at http://localhost:4000.

### Password Reset Function
To use the password reset function, follow these steps:

- Open the passwordReset.js file.
- Scroll down to line 66.
- Enter your Gmail address at line 66.
- Enter the password for that Gmail address at line 67.
- Enter the Gmail address again at line 73.
- Note: Ensure that the Google account for this email has 'less secure apps' enabled and 2FA disabled.

## Project Structure
```
.vscode/
    settings.json
db.js
package.json
public/
    styles/
        style.css
README.md
routes/
    confirm.js
    login.js
    manager.js
    passwordReset.js
    quiz.js
    result.js
    student.js
server.js
views/
    confirm.ejs
    login.ejs
    managerHome.ejs
    passwordReset.ejs
    quiz.ejs
    result.ejs
    studentHome.ejsÍ
```

## Dependencies
The project uses the following dependencies:

- bcrypt
- body-parser
- ejs
- express
- express-session
- he
- helmet
- mysql2
- nodemailer
- nodemod
- nodemon
- pdfmake

## License
This project is licensed under the ISC License.
