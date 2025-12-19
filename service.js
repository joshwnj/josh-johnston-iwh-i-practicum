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

  return data
}

async function fetchSingleQuest({ id }) {
  const qs = querystring.stringify({
    properties: [
      'name',
      'description',
      'reward'
      ].join(',')
  })
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE_IDS.QUESTS}/${id}?${qs}`
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };


  const resp = await axios.get(url, { headers });

  const { data } = resp;
  return data.properties
}

async function updateQuest ({ id, payload }) {
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE_IDS.QUESTS}`
  const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
  };

  return axios.patch(`${url}/${id}`, payload, { headers });
}

async function createQuest ({ payload }) {
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
