import axios from 'axios'
import { useEffect, useState } from 'react'
import Chart from '../components/LineChart'
import TxChart from 'components/BarChart'
import Layout from 'components/Layout'

export default function Home() {
  const [overviewData, setOverviewData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const resp = await axios.get(`/api/overview`)

    setOverviewData(
      resp.data.map((x) => {
        x.time = x.date

        return x
      })
    )
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto min-h-screen p-2">
        <p className="mt-16">Overview</p>
        <div className="flex flex-wrap min-w-full -mx-4">
          <div className="w-full lg:w-1/2 p-4">
            <Chart overviewData={overviewData} />
          </div>
          <div className="w-full lg:w-1/2 p-4">
            <TxChart overviewData={overviewData} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
