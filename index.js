require('dotenv').config()

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const { PRIVATE_APP_ACCESS } = process.env;

const SITE_TITLE = 'Integrating With HubSpot I Practicum'

// TODO: fetch from schema
const OBJECT_TYPE_IDS = {
  QUESTS: '2-54772188'
}

// ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE_IDS.QUESTS}?properties=name,description,reward`
  const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
  };

  try {
      const resp = await axios.get(url, { headers } );
      const data = resp.data.results;

      res.render('homepage', { title: `Home | ${SITE_TITLE}`, data });
  } catch(err) {
      console.error(err);
  }
})

// ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', (req, res) => {
  const contactEmail = ''
  const quest = {}

  res.render('updates', {
    title: `Update Custom Object Form | ${SITE_TITLE}`,
    contactEmail,
    quest
  })
})

// ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
  const {
    name,
    description,
    reward
  } = req.body

  const payload = {
    properties: {
      name,
      description,
      reward
    }
  }

  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE_IDS.QUESTS}`
  const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
  };

  try {
      await axios.post(url, payload, { headers } );
      res.redirect('/');
  } catch(err) {
      console.error(err);
  }
})

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
