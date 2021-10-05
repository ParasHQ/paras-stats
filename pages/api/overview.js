import axios from 'axios'
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

  const respNearMarketInfo = await axios.get(
    `https://api.coingecko.com/api/v3/coins/near/market_chart?vs_currency=usd&days=30&interval=daily`
  )

  const prices = respNearMarketInfo.data.prices.map((x) => {
    const d = new Date(x[0])
    return {
      date: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
      price: x[1],
    }
  })

  const y = x.reduce((a, b) => {
    const d = new Date(b.issued_at)
    b.date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    b.dateTs = new Date(b.date).getTime()

    const primarySales = b.type === 'nft_transfer' ? 1 : 0
    const secondarySales = b.type === 'resolve_purchase' ? 1 : 0

    const hasUsdPrice = prices.find((x) => x.date === b.date)
    const usdPrice = hasUsdPrice
      ? hasUsdPrice.price
      : prices[prices.length - 1].price

    if (a[b.dateTs]) {
      const price = JSBI.BigInt(b.price.toString())
      const currentVolume = JSBI.BigInt(a[b.dateTs].volume || '0')
      const newVolume = JSBI.add(currentVolume, price).toString()
      a[b.dateTs].volume = newVolume
      a[b.dateTs].volumeUsd = (newVolume / 10 ** 24) * usdPrice
      a[b.dateTs].primarySales += primarySales
      a[b.dateTs].secondarySales += secondarySales
    } else {
      a[b.dateTs] = {
        primarySales: primarySales,
        secondarySales: secondarySales,
        volume: b.price.toString(),
        volumeUsd: (b.price.toString() / 10 ** 24) * usdPrice,
        date: b.date,
      }
    }
    return a
  }, {})

  const sortedData = Object.keys(y)
    .sort()
    .map((x) => y[x])

  res.status(200).json(sortedData)
}
