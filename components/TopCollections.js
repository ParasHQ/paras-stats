import axios from 'axios'
import { useEffect, useState } from 'react'
import { parseImgUrl, prettyBalance } from 'utils/common'

const HEADERS = [
  {
    id: 'collection_id',
    title: 'Collection',
    className: `w-3/6`,
  },
  {
    id: 'volume_usd',
    title: 'Volume',
    className: `w-1/6 text-right`,
  },
  {
    id: 'avg_price_usd',
    title: 'Avg. Price',
    className: `w-1/6 text-right`,
  },
  {
    id: 'owner_count',
    title: 'Owners',
    className: `w-1/6 text-right`,
  },
]

const LIMIT = 10

const RowCollection = ({ d }) => {
  const [collection, setCollection] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const resp = await axios.get(
        `https://api-v2-mainnet.paras.id/collections`,
        {
          params: {
            collection_id: d.collection_id,
          },
        }
      )
      setCollection(resp.data.data.results[0])
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <a href={`https://paras.id/collection/${d.collection_id}`}>
      <div className="flex items-center p-3 hover:bg-gray-800">
        <div className={`${HEADERS[0].className} flex items-center h-12`}>
          <div className="w-10 h-10 bg-blue-900 rounded-full overflow-hidden">
            {collection?.media && (
              <img src={parseImgUrl(collection?.media)} className="bg-cover" />
            )}
          </div>
          <div className="pl-4">
            <p className="font-semibold">{collection?.collection}</p>
            <span className="text-sm text-gray-300">
              by{` `}
              <a
                href={`https://paras.id/${collection?.creator_id}/creation`}
                className="font-semibold hover:border-b-2 border-gray-300"
              >
                {collection?.creator_id}
              </a>
            </span>
          </div>
        </div>
        <div className={HEADERS[1].className}>
          ${prettyBalance(d.volume_usd, 0, 4)}
        </div>
        <div className={HEADERS[2].className}>
          ${prettyBalance(d.avg_price_usd, 0, 4)}
        </div>
        <div className={HEADERS[3].className}>{d.owner_count}</div>
      </div>
    </a>
  )
}

const TopCollections = ({ data }) => {
  const [localData, setLocalData] = useState(data)
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState(`volume_usd`)
  const [orderBy, setOrderBy] = useState(`desc`)

  useEffect(() => {
    const currData = [...localData]
    currData.sort((a, b) => {
      if (orderBy === 'desc') {
        return a[sortBy] > b[sortBy] ? -1 : a[sortBy] < b[sortBy] ? 1 : 0
      } else {
        return a[sortBy] > b[sortBy] ? 1 : a[sortBy] < b[sortBy] ? -1 : 0
      }
    })
    setLocalData(currData)
  }, [sortBy, orderBy])

  return (
    <div className="w-full bg-black bg-opacity-25 rounded-lg overflow-hidden">
      <div className="flex text-gray-300 border-gray-800 border-b-2 p-3">
        {HEADERS.map((d) => {
          return (
            <div
              className={`${d.className} cursor-pointer hover:opacity-75`}
              onClick={() => {
                if (sortBy === d.id) {
                  if (orderBy === 'desc') {
                    setOrderBy('asc')
                  } else {
                    setOrderBy('desc')
                  }
                } else {
                  setSortBy(d.id)
                  setOrderBy('desc')
                }
              }}
            >
              <span>{d.title}</span>
              {sortBy === d.id ? (
                <span className="inline-block pl-2">
                  {orderBy === 'desc' ? '↓' : '↑'}
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
      {localData.slice(page * LIMIT, (page + 1) * LIMIT).map((d) => {
        return (
          <div key={d.collection_id}>
            <RowCollection d={d} />
          </div>
        )
      })}
      <div className="flex items-center justify-center p-3">
        <button
          className="disabled:opacity-75"
          disabled={page === 0}
          onClick={() => {
            setPage(page - 1)
          }}
        >
          Prev
        </button>
        <div className="px-8">
          {page + 1} / {Math.ceil(localData.length / LIMIT)}
        </div>
        <button
          className="disabled:opacity-75"
          disabled={page === Math.ceil(localData.length / LIMIT)}
          onClick={() => {
            setPage(page + 1)
          }}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default TopCollections
