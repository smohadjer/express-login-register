import express from 'express';
import bcrypt from 'bcrypt';

const saltRounds = 10;
const users = [];
const app = express();

app.use(express.json());

app.get('/users', (req, res) => {
  res.json(users)
});

app.post('/users/register', async (req, res) => {
  try {
    // some error handing examples
    if (req.body.password.length < 5)
      throw new Error('password is too short');
    if (users.some(user => user.username === req.body.username))
      throw new Error('user already exists');

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const user = {
      username: req.body.username,
      password: hashedPassword
    }
    users.push(user);
    res.status(201).send(`User ${user.username} is registered`);
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
});

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.username === req.body.username);

  if (!user) {
    res.status(400).send('User was not found');
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('login was successful');
    } else {
      throw new Error('login failed');
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});

console.log('app listenting on port 3000')
app.listen(3000);
