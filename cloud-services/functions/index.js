const { version } = require('./package.json');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = express();

if (admin.apps.length === 0){
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}


app.use(cors({ origin: true }));

app.use(bodyParser.json());

app.get('/api/', (req, rep) =>
  rep.status(200).send(`OTC ${version} ONLINE`));

app.get('/api/alive', (req, rep) => 
  rep.status(200).send('true'));

app.get('/api/cards/:id', async (req, rep) => {

  try {
  
    let snap = await admin.firestore().doc(`/cards/${req.params.id}`).get();

    if(!snap.exists)
      return rep.status(404).send('false');

    return rep.status(200).send(snap.data());

  } catch (err) {

    return rep.status(500).send(err.message);

  }

});

app.get('/api/gifts/:id', async (req, rep) => {

  try {
    let id = parseInt(req.params.id) % 3;
    
    if(id === 0) id = 3;
  
    let snap = await admin.firestore().doc(`/gifts/${id}`).get();

    if(!snap.exists)
      return rep.status(404).send('false');

    return rep.status(200).send(snap.data());

  } catch (err) {

    return rep.status(500).send(err.message);

  }

});

app.get('/api/nft-amazon/:id', async (req, rep) => {

  try {
    let snap = await admin.firestore().doc(`/nft-amazons/${req.params.id}`).get();

    if(!snap.exists)
      return rep.status(404).send('false');

    return rep.status(200).send(snap.data());

  } catch (err) {

    return rep.status(500).send(err.message);

  }

});

exports.services = functions.https.onRequest(app);