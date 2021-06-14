const admin = require('../')

const firestore = admin.firestore()

const collectionRef = firestore.collection('stocks')

const updateStock = async (data) => {
  const snapshot = await collectionRef.doc(data.id).get()

  if (!snapshot.exists) {
    await collectionRef.doc(data.id).set(data)
  } else {
    await collectionRef.doc(data.id).update(data)
  }
}

module.exports = {
  updateStock,
}
