import db from 'repositories/database'

export default async function overviewAPI(req, res) {
  if (!db.ready) {
    await db.init()
  }

  const overviewStats = await db.root.collection('kv_store').findOne({
    key: 'overview_stats_worker',
  })
  res.status(200).json(overviewStats.value)
}
