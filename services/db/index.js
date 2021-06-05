const admin = require('firebase-admin')

const serviceAccount = require('./serviceAccountKey.json')

const { DATABASE_URL } = process.env

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: DATABASE_URL,
})

module.exports = admin
