import express from 'express';
import Model from '../model/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();


router.post('/auth/register', async (req, res) => {
    const {firstName, surname, email, number, dateOfBirth, gender, password } = req.body;

    if (password.length < 8) {
        return res
        .status(400)
        .json({message: 'Password is less than 8     characters' });
    }
    try {
        bcrypt.hash(password, 10).then(async (hash) => {
            await Model.create({firstName, surname, number, dateOfBirth, gender, email, password: hash }).then(
                (user) => {
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        { id: user._id, email },
                        '27db19bc01e56f15b727229149d313ab5d2d3383955f1ee472ad93dbfe2cbbb5',
                        // process.env.JWT_SECRET_KEY,
                        { expiresIn: maxAge }
                    );
                    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                    res.status(201).json({ message: 'User successfully created', user });
                }
            );
        });
    } catch (err) {
        res.status(400).json({
            message: 'User not successfully created',
            error: err.message,
        });
    }
});

router.post('/auth/login', async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'email or password not provided'});
    }
    try {
        const user = await Model.findOne({ email });
        if (!user) {
            res
            .status(400)
            .json({ message: 'Login not successful', error: 'User not found' });
        } else {
            bcrypt.compare(password, user.password).then(function (result) {
             if (result) {
                const maxAge = 3 * 60 * 60;
                const token = jwt.sign(
                    { id: user._id, email },
                    '27db19bc01e56f15b727229149d313ab5d2d3383955f1ee472ad93dbfe2cbbb5',
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: maxAge }
                );
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.status(201).json({ message: 'Login successful', user, token });
             } else {
                res.status(400).json({ message: 'Invalid Credential' });
             }
            });
        }
    } catch (err) {
        res.status(400).json({ message: 'An error occurred', error: err.message });
    }
})

router.get('/getAll', async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/getById/:id", async (req, res) => {
    try {
      const data = await Model.findById(req.params.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
  
export default router;