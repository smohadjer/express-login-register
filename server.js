import express from 'express';
import bcrypt from 'bcrypt';

const app = express();

app.use(express.json());

const users = [];

app.get('/users', (req, res) => {
  res.json(users)
});

app.post('/users/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const user = {
      username: req.body.username,
      password: hashedPassword
    }
    users.push(user);
    res.status(201).send(`User ${user.username} is registered`);
  } catch {
    res.status(500).send();
  }
});

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.username === req.body.username);

  if (user === null) {
    res.status(400).send('User was not found');
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('succss');
    } else {
      res.send('failed');
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(3000);
