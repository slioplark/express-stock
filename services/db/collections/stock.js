const admin = require('../')

const firestore = admin.firestore()

const collectionRef = firestore.collection('stocks')

const updateStock = async (data) => {
  const snapshot = await collectionRef.doc(data.date).get()

  if (!snapshot.exists) {
    await collectionRef.doc(data.date).set(data)
  } else {
    await collectionRef.doc(data.date).update(data)
  }
}

module.exports = {
  updateStock,
}
