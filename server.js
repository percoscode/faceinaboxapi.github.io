const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {
    // Load hash from your password DB.
    bcrypt.compare("apples", hash, function(err, res) {
        //this wont work unless you use dummy hash
        console.log('first guess', res)
        res === true
    });
    bcrypt.compare("not_bacon", hash, function(err, res) {
        //this wont work unless you use dummy hash
        console.log('second guess')
        res === false
    });
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json('success')
    } else {
        res.status(400).json('error logging in')
    }
    res.json('signin')
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("B4c0/\/", salt, function(err, hash) {
            // Store hash in your password DB.
            console.log(hash)
        });
    });
    database.users.push({
        id: '123',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1])
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

// Load hash from your password DB.
// bcrypt.compare("B4c0/\/", hash, function(err, res) {
//     // res === true
// });
// bcrypt.compare("not_bacon", hash, function(err, res) {
//     // res === false
// });
 
// // As of bcryptjs 2.4.0, compare returns a promise if callback is omitted:
// bcrypt.compare("B4c0/\/", hash).then((res) => {
//     // res === true
// });

app.listen(3000, ()=> {
    console.log('app is running on port 3000');
})

/*
/ --> =this is working
/signin --> POST = succes/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/