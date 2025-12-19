const path = require('path')
const express = require('express');
const app = express();

const service = require('./service')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const SITE_TITLE = 'Integrating With HubSpot I Practicum'

// ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
  try {
    const data = await service.fetchQuests()
    res.render('homepage', { title: `Home | ${SITE_TITLE}`, data });
  } catch(err) {
    console.error(err);
  }
})

// ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', async (req, res) => {
  const { id } = req.query

  if (id) {
    try {
      const quest = await service.fetchSingleQuest({ id })
      res.render('updates', {
        title: `Update Custom Object Form | ${SITE_TITLE}`,
        id,
        quest,
        error: null
      })
    } catch (err) {
      console.error(err);
    }
  }
  else {
    const quest = {
      properties: {},
      contact: {
        properties: {
          email: null
        }
      }
    }

    res.render('updates', {
      title: `Create Custom Object Form | ${SITE_TITLE}`,
      quest,
      error: null
    })
  }
})

// ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
  const {
    id,
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

  const isUpdate = !!id
  if (isUpdate) {

    try {
      await service.updateQuest({ id, payload })

      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.render('updates', {
        title: `Update Custom Object Form | ${SITE_TITLE}`,
        contactEmail: '',
        quest: {
          id,
          name,
          description,
          reward
        },
        error: err.message
      })
    }
  } else {
    // create a new object
    try {
      await service.createQuest({ payload })
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.render('updates', {
        title: `Create Custom Object Form | ${SITE_TITLE}`,
        contactEmail: '',
        quest: {
          name,
          description,
          reward
        },
        error: err.message
      })
    }
  }
})

// * Localhost
const { PORT = 3000 } = process.env
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
