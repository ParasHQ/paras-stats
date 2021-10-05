import JSBI from 'jsbi'
import db from 'repositories/database'

const MONTH_AGO = 30 * 24 * 60 * 60 * 1000

export default async function overviewAPI(req, res) {
  if (!db.ready) {
    await db.init()
  }

  const x = await db.root
    .collection('activities')
    .find({
      $or: [
        {
          type: 'nft_transfer',
          price: {
            $ne: null,
          },
        },
        {
          type: 'resolve_purchase',
        },
      ],
      issued_at: {
        $gte: new Date().getTime() - MONTH_AGO,
      },
    })
    .toArray()

  const y = x
    .map((x) => {
      const d = new Date(x.issued_at)
      x.date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
      x.dateTs = new Date(x.date).getTime()
      return x
    })
    .reduce((a, b) => {
      const primarySales = b.type === 'nft_transfer' ? 1 : 0
      const secondarySales = b.type === 'resolve_purchase' ? 1 : 0

      if (a[b.dateTs]) {
        const price = JSBI.BigInt(b.price.toString())
        const currentVolume = JSBI.BigInt(a[b.dateTs].volume || '0')
        a[b.dateTs].volume = JSBI.add(currentVolume, price).toString()
        a[b.dateTs].primarySales += primarySales
        a[b.dateTs].secondarySales += secondarySales
      } else {
        a[b.dateTs] = {
          primarySales: primarySales,
          secondarySales: secondarySales,
          volume: b.price.toString(),
          date: b.date,
        }
      }
      return a
    }, {})

  const sortedData = Object.keys(y)
    .sort()
    .reverse()
    .map((x) => y[x])

  res.status(200).json(sortedData)
}
