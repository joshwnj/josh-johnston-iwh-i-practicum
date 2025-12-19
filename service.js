require('dotenv').config()
const axios = require('axios');
const querystring = require('querystring');

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const { PRIVATE_APP_ACCESS } = process.env;

// TODO: fetch from schema
const OBJECT_TYPE_IDS = {
  QUESTS: '2-54772188'
}

async function fetchQuests () {
  const qs = querystring.stringify({
    properties: [
      'name',
      'description',
      'reward'
      ].join(','),
    associations: [
      'contacts'
      ].join(',')
  })

  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE_IDS.QUESTS}?${qs}`
  const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
  };

  const resp = await axios.get(url, { headers } );
  const data = resp.data.results;

  const contacts = await fetchAssociatedContacts(data)
  return populateContacts({ data, contacts })
}

async function fetchAssociatedContacts (data) {
  const url = `https://api.hubapi.com/crm/v3/objects/contacts/batch/read`
  const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
  };

  const payload = {
    inputs: data.map(item => item.associations?.contacts?.results[0].id)
      .filter(Boolean)
      .map(id => ({id}))
  }

  const resp = await axios.post(url, payload, { headers } );
  return resp.data.results
}

function populateContacts ({ data, contacts }) {
  // create a lookup of contacts
  const contactsById = {}
  for (const contact of contacts) {
    const { id } = contact
    contactsById[id] = contact
  }

  for (const quest of data) {
    const contactId = quest.associations?.contacts?.results[0].id
    quest.contact = contactsById[contactId] || {
      properties: {
        email: null
      }
    }
  }

  return data
}

async function fetchSingleQuest({ id }) {
  // TODO: optimise by only fetching one record
  const quests = await fetchQuests()
  return quests.find(quest => quest.id === id)
}

async function updateQuest ({ id, payload }) {
  // TODO: handle updating contact association
  //
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE_IDS.QUESTS}`
  const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
  };

  return axios.patch(`${url}/${id}`, payload, { headers });
}

async function createQuest ({ payload }) {
  // TODO: handle creating contact association

  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE_IDS.QUESTS}`
  const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
  };

  return axios.post(url, payload, { headers });
}

module.exports = {
  fetchQuests,
  fetchSingleQuest,
  updateQuest,
  createQuest
}
