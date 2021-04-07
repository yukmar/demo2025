export async function getAllSites() {
  const snapshot = await db.collection('sites').get();
  const sites = [];
  snapshot.forEach((doc) => {
    sites.push({id: doc.id, ...doc.data()});
  });
  return {sites};
}
