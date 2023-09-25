const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost/dating-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define the profile schema
const profileSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    country: String,
    region: String
});

// Define the profile model
const Profile = mongoose.model('Profile', profileSchema);

// Create a new Express.js app
const app = express();

// Use the body-parser middleware
app.use(bodyParser.json());

// Define the API routes
app.post('/api/profile', function(req, res) {
    // Create a new profile
    const profile = new Profile({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        country: req.body.country,
        region: req.body.region
    });

    // Save the profile to the database
    profile.save(function(err) {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

app.post('/auth', function(req, res) {
    const telegramId = req.body.id;
    const accessToken = req.body.access_token;

    // Verify the access token with Telegram
    request(`https://api.telegram.org/bot${accessToken}/getMe`, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            const botInfo = JSON.parse(body);
            if (botInfo.ok && botInfo.result.id == YOUR_BOT_ID) {
                // Authentication successful
                res.sendStatus(200);
            } else {
                // Invalid access token
                res.sendStatus(401);
            }
        } else {
            // Error verifying access token
            res.sendStatus(500);
        }
    });
});

app.listen(3000, function() {
    console.log('Server listening on port 3000');
});