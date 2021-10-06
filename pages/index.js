import axios from 'axios'
import { useEffect, useState } from 'react'
import Chart from '../components/LineChart'
import TxChart from 'components/BarChart'
import Layout from 'components/Layout'
import TopCollections from 'components/TopCollections'
import Logo from 'components/Logo'

export default function Home() {
  const [overviewData, setOverviewData] = useState([])
  const [collectionData, setCollectionData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const resp = await axios.get(`/api/overview`)
    const resp1 = await axios.get(`/api/collections`)

    setOverviewData(
      resp.data.map((x) => {
        x.time = x.date

        return x
      })
    )

    setCollectionData(resp1.data)
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto min-h-screen p-4">
        <div className="flex items-center py-4">
          <div className="w-1/3"></div>
          <div className="w-1/3">
            <div className="w-24 mx-auto">
              <Logo />
            </div>
          </div>
          <div className="w-1/3 text-right">
            <a
              className="hover:opacity-75"
              target="_blank"
              href="https://paras.id"
            >
              <span>Visit Paras</span>
              <svg
                className="inline-block pl-1 -mt-2"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5 5V19H19V12H21V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H12V5H5ZM14 5V3H21V10H19V6.41L9.17 16.24L7.76 14.83L17.59 5H14Z"
                  fill="white"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-8">
          <p className="font-semibold text-xl">Overview</p>
          <div className="flex flex-wrap min-w-full -mx-4">
            <div className="w-full lg:w-1/2 p-4">
              <Chart overviewData={overviewData} />
            </div>
            <div className="w-full lg:w-1/2 p-4">
              <TxChart overviewData={overviewData} />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <p className="font-semibold text-xl">Top Collections</p>
          {collectionData.length > 0 && (
            <div className="mt-4">
              <TopCollections data={collectionData} />
            </div>
          )}
        </div>
        <div className="mt-16 mb-2 flex flex-wrap justify-between">
          <div className="-mx-2 flex items-center flex-wrap text-gray-300">
            <div className="px-2">
              <a
                className="hover:text-white"
                href="https://paras.id"
                target="_blank"
              >
                Marketplace
              </a>
            </div>
            <div className="p-2">
              <a
                className="hover:text-white"
                href="https://team.paras.id"
                target="_blank"
              >
                About
              </a>
            </div>
          </div>
          <div>
            <div>(c) Paras 2021</div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
