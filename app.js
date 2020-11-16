const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
  res.json({
    msg: 'Welcome to the API'
  });
});

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    //the token was already put in req
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  //Mock user
  const user = {
    id: 1,
    username: 'brad',
    email: 'brad@gamil.com'
  };

  //payload,secret key
  jwt.sign(
    { /*user: user*/ user },
    'secretkey',
    { expiresIn: '30s' },
    (err, token) => {
      //here we sent the user
      res.json({
        //token: token
        token
      });
    }
  );
});

//FORMAT OF TOKEN
//Authorization: Bearer <access_token> - and we need to pull the token out of it

//Verify Token
function verifyToken(req, res, next) {
  //token sent in header as auth value
  ///Get auth header value
  const bearerHeader = req.headers['authorization']; // this will give us the actual token
  //Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    //Split at the space (bearer token)
    const bearer = bearerHeader.split(' ');
    //Get token from array
    const bearerToken = bearer[1];
    //Set the token
    req.token = bearerToken;
    //Next middleware
    next();
  } else {
    //Forbidden
    res.sendStatus(403);
  }
}

app.listen(5000, () => console.log('Server started on port 5000'));
