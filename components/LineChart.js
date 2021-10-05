import { useEffect, useRef, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const Chart = ({ overviewData }) => {
  const containerRef = useRef(null)
  const [data, setData] = useState([])
  const [tooltipData, setTooltipData] = useState(null)

  useEffect(() => {
    if (containerRef && overviewData.length > 0) {
      loadChart()
    }
  }, [overviewData])

  useEffect(() => {
    if (!tooltipData && overviewData.length > 0) {
      calculateTotalVolume()
    }
  }, [tooltipData, overviewData])

  const loadChart = async () => {
    const d = overviewData.map((x) => ({
      name: x.date,
      value: x.volumeUsd,
    }))
    setData(d)
  }

  const calculateTotalVolume = () => {
    const totalVolume = overviewData.reduce((a, b) => {
      return a + b.volumeUsd
    }, 0)
    setTooltipData({
      title: `${totalVolume} USD`,
      subtitle: null,
    })
  }

  return (
    <div className="h-60">
      {tooltipData && (
        <div>
          <div>Volume</div>
          <div>{tooltipData.title}</div>
          <div>{tooltipData.subtitle}</div>
        </div>
      )}

      {data.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            onMouseLeave={() => {
              setTooltipData(null)
            }}
          >
            <XAxis dataKey="name" />
            <Tooltip
              contentStyle={{ display: 'none' }}
              formatter={(value, name, props) => {
                const newTitle = `${value} USD`
                if (tooltipData && tooltipData.title != newTitle) {
                  setTooltipData({
                    title: newTitle,
                    subtitle: props.payload.name,
                  })
                }
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default Chart
