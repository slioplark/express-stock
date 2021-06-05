const admin = require('../')

const firestore = admin.firestore()

const collectionRef = firestore.collection('lines')

const getUserIds = async () => {
  const snapshot = await collectionRef.get()
  return snapshot.docs.map((item) => item.data().userId)
}

const createUserId = async (userId) => {
  await collectionRef.doc(userId).set({ userId: userId })
}

const deleteUserId = async (userId) => {
  await collectionRef.doc(userId).delete()
}

module.exports = {
  getUserIds,
  createUserId,
  deleteUserId,
}
