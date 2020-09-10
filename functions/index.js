const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const app = express();

app.post('/', async (request, response) => {
    const user = request.body;
    if (user !== null || user !== '') {
        const userCollectionRef = db.collection('users');
        const result = await userCollectionRef.add(user);

        response.status(200).send(result);
    } else {
        response.status(400).send("Empty !");
    }

});
app.get('/', async (request, response) => {
    const userCollectionRef = db.collection('users');
    const result = await userCollectionRef.get();

    let users = [];
    if (result) {
        result.forEach((userDoc) => {
            const id = userDoc.id;
            const user = userDoc.data();
            users.push({ id, ...user });
        });


        response.status(200).send(users);
    } else {
        response.status(201).send('Nothing found');
    }

});

app.get('/:id', async (request, response) => {
    const userCollectionRef = db.collection('users');
    const result = await userCollectionRef.doc(request.params.id).get();

    if (result) {
        const id = result.id;
        const user = result.data();

        response.status(200).send({ id, ...user });
    } else {
        response.status(201).send('Not found');
    }

});

app.delete('/:id', async (request, response) => {
    const userCollectionRef = db.collection('users');
    const result = await userCollectionRef.doc(request.params.id).delete();

    if (result) {
        response.status(200).send(`Item deleted`);
    } else {
        response.status(201).send('Not found');
    }
});

app.put('/:id', async (request, response) => {
    const userCollectionRef = db.collection('users');
    const result = await userCollectionRef.doc(request.params.id).put(request.body);

    response.status(200).send(result);
});

exports.users = functions.https.onRequest(app);
