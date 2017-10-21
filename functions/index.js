const admin = require('firebase-admin');
const functions = require('firebase-functions');
const express = require('express')
var path = require("path");

const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var app = express();
app.set('view engine', 'ejs')

exports.generateSharingMetadata = functions.https.onRequest(
  app.get("/events/:eventid*", (req, res) => {
    var userAgent = req.headers['user-agent'];
    var db = admin.firestore();
    if (/^(facebookexternalhit)|(Twitterbot)|(Pinterest)/gi.test(userAgent)) {
      db.collection('events').doc(req.params.eventid).get().then((doc) => {
        if (doc.exists) {
          var event_title = doc.data().title;
          var short_description = doc.data().short_description;
          var start_time = doc.data().start_time;
          var end_time = doc.data().end_time;
          res.send(`
            <!DOCTYPE html>
            <html>
              <head>
                <!-- Facebook sharing meta data -->
                <meta property="og:title" content="${event_title}">
                <meta property="og:site_name" content="GDG Kuala Lumpur">
                <meta property="og:type" content="Event">
                <meta property="og:url" content="https://gdg-kl-dev.firebaseapp.com/events/${req.params.eventid}">
                <meta property="og:description" content="${short_description}">
                <meta property="og:image" content="https://gdg-kl-dev.firebaseapp.com/images/gdgkl.jpg">
                <meta property="og:image:type" content="image/jpeg" />

                <!-- G+ sharing meta data -->
                <meta itemprop="name" content="${event_title}">
                <meta itemprop="description" content="${short_description}">
                <meta itemprop="image" content="https://gdg-kl-dev.firebaseapp.com/images/gdgkl.jpg">
                <meta itemprop="startDate" content="${start_time}">
                <meta itemprop="endDate" content="${end_time}">
            
                <!-- Twitter meta data -->
                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:creator" content="@gdgkl">
                <meta name="twitter:title" content="${event_title}">
                <meta name="twitter:description" content="${short_description}">
                <meta name="twitter:image" content="https://gdg-kl-dev.firebaseapp.com/images/gdgkl.jpg">
              </head>
              <body>
                <h1>${event_title}</h1>
                <p>${short_description}</p>
              </body>
            </html>
          `)
        }
        else {
          res.sendFile('./build/firebase/index.html', { root: '.' });
        }
      }).catch(error => {
        res.send('error')
      })
    }
    else {
      res.sendFile('./build/firebase/index.html', { root: '.' });
    }
  }),

  app.get("/events", (req, res) => {
    res.sendFile('./build/firebase/index.html', { root: '.' });
  })
)