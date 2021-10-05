import axios from 'axios'
import JSBI from 'jsbi'
import db from 'repositories/database'

const MONTH_AGO = 30 * 24 * 60 * 60 * 1000

const DUMMY = [
  {
    primarySales: 140,
    secondarySales: 12,
    volume: '355860000000000000000000000',
    volumeUsd: 2175.77167280737,
    date: '2021-9-7',
    dateTs: 1630947600000,
  },
  {
    primarySales: 286,
    secondarySales: 28,
    volume: '234992000000000000000000000',
    volumeUsd: 2031.9623705500755,
    date: '2021-9-8',
    dateTs: 1631034000000,
  },
  {
    primarySales: 259,
    secondarySales: 19,
    volume: '279444100000000000000000000',
    volumeUsd: 2896.4895479823367,
    date: '2021-9-9',
    dateTs: 1631120400000,
  },
  {
    primarySales: 295,
    secondarySales: 24,
    volume: '760840400000000000000000000',
    volumeUsd: 7439.346110436413,
    date: '2021-9-10',
    dateTs: 1631206800000,
  },
  {
    primarySales: 190,
    secondarySales: 8,
    volume: '138845310000000000000000000',
    volumeUsd: 1375.6015111805723,
    date: '2021-9-11',
    dateTs: 1631293200000,
  },
  {
    primarySales: 289,
    secondarySales: 20,
    volume: '381266210000000010000000000',
    volumeUsd: 3419.4431584447766,
    date: '2021-9-12',
    dateTs: 1631379600000,
  },
  {
    primarySales: 349,
    secondarySales: 26,
    volume: '337047712000000000000000000',
    volumeUsd: 3038.1550664538454,
    date: '2021-9-13',
    dateTs: 1631466000000,
  },
  {
    primarySales: 2439,
    secondarySales: 74,
    volume: '666973400010000000000000000',
    volumeUsd: 5493.6611448655285,
    date: '2021-9-14',
    dateTs: 1631552400000,
  },
  {
    primarySales: 7042,
    secondarySales: 76,
    volume: '477597650000000000000000000',
    volumeUsd: 4125.2048354732515,
    date: '2021-9-15',
    dateTs: 1631638800000,
  },
  {
    primarySales: 4213,
    secondarySales: 44,
    volume: '790089417789000000010000000',
    volumeUsd: 7345.288080339262,
    date: '2021-9-16',
    dateTs: 1631725200000,
  },
  {
    primarySales: 2016,
    secondarySales: 70,
    volume: '619997860101010000000000000',
    volumeUsd: 5435.7753037380935,
    date: '2021-9-17',
    dateTs: 1631811600000,
  },
  {
    primarySales: 4013,
    secondarySales: 56,
    volume: '3244976945000300000000000000',
    volumeUsd: 27032.71901769288,
    date: '2021-9-18',
    dateTs: 1631898000000,
  },
  {
    primarySales: 2919,
    secondarySales: 82,
    volume: '547432057150099000000000000',
    volumeUsd: 4974.184952268788,
    date: '2021-9-19',
    dateTs: 1631984400000,
  },
  {
    primarySales: 4094,
    secondarySales: 178,
    volume: '555780507000000000000000000',
    volumeUsd: 5528.805686998488,
    date: '2021-9-20',
    dateTs: 1632070800000,
  },
  {
    primarySales: 3268,
    secondarySales: 176,
    volume: '557001565010000000000000000',
    volumeUsd: 4284.0598780172295,
    date: '2021-9-21',
    dateTs: 1632157200000,
  },
  {
    primarySales: 2217,
    secondarySales: 94,
    volume: '686285410000000000000000000',
    volumeUsd: 4532.411376151518,
    date: '2021-9-22',
    dateTs: 1632243600000,
  },
  {
    primarySales: 2339,
    secondarySales: 46,
    volume: '485344259000000000000000000',
    volumeUsd: 3710.517838448043,
    date: '2021-9-23',
    dateTs: 1632330000000,
  },
  {
    primarySales: 1489,
    secondarySales: 88,
    volume: '442550700000000000000000000',
    volumeUsd: 4112.340581560742,
    date: '2021-9-24',
    dateTs: 1632416400000,
  },
  {
    primarySales: 1359,
    secondarySales: 93,
    volume: '500373733000000000000000000',
    volumeUsd: 3974.7346659017394,
    date: '2021-9-25',
    dateTs: 1632502800000,
  },
  {
    primarySales: 1893,
    secondarySales: 445,
    volume: '1252309919000000000000000000',
    volumeUsd: 9620.702180501139,
    date: '2021-9-26',
    dateTs: 1632589200000,
  },
  {
    primarySales: 1434,
    secondarySales: 74,
    volume: '794610718111110000000000000',
    volumeUsd: 5796.216842216748,
    date: '2021-9-27',
    dateTs: 1632675600000,
  },
  {
    primarySales: 843,
    secondarySales: 73,
    volume: '637496062200000000000000000',
    volumeUsd: 4383.6272838331015,
    date: '2021-9-28',
    dateTs: 1632762000000,
  },
  {
    primarySales: 899,
    secondarySales: 82,
    volume: '884472048000000000000000000',
    volumeUsd: 5646.207158757612,
    date: '2021-9-29',
    dateTs: 1632848400000,
  },
  {
    primarySales: 633,
    secondarySales: 91,
    volume: '1022182744000000000000000000',
    volumeUsd: 6825.026853075109,
    date: '2021-9-30',
    dateTs: 1632934800000,
  },
  {
    primarySales: 400,
    secondarySales: 65,
    volume: '213674920000000000000000000',
    volumeUsd: 1479.7088353779654,
    date: '2021-10-1',
    dateTs: 1633021200000,
  },
  {
    primarySales: 637,
    secondarySales: 29,
    volume: '206541353100000000000000000',
    volumeUsd: 1612.9484587477673,
    date: '2021-10-2',
    dateTs: 1633107600000,
  },
  {
    primarySales: 1222,
    secondarySales: 44,
    volume: '346618250000000000000000000',
    volumeUsd: 2725.4817058849917,
    date: '2021-10-3',
    dateTs: 1633194000000,
  },
  {
    primarySales: 1664,
    secondarySales: 138,
    volume: '462565580000000000000000000',
    volumeUsd: 3722.7256274467522,
    date: '2021-10-4',
    dateTs: 1633280400000,
  },
  {
    primarySales: 1205,
    secondarySales: 47,
    volume: '566907236000000000000000000',
    volumeUsd: 4344.5577954535975,
    date: '2021-10-5',
    dateTs: 1633366800000,
  },
]

export default async function overviewAPI(req, res) {
  if (process.env.NODE_ENV === 'development') {
    return res.status(200).json(DUMMY)
  }
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
        dateTs: b.dateTs,
      }
    }
    return a
  }, {})

  const sortedData = Object.keys(y)
    .sort()
    .map((x) => y[x])

  res.status(200).json(sortedData)
}
