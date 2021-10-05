import axios from 'axios'
import { useEffect, useState } from 'react'
import Chart from '../components/LineChart'
import TxChart from 'components/BarChart'

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
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <p>Overview</p>
      <div className="flex min-w-full">
        <div className="w-1/2">
          <Chart overviewData={overviewData} />
        </div>
        <div className="w-1/2">
          <TxChart overviewData={overviewData} />
        </div>
      </div>
    </div>
  )
}
