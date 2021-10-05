import { useEffect, useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const TxChart = ({ overviewData }) => {
  const [tooltipTitle, setTooltipTitle] = useState(null)
  const [tooltipPrimary, setTooltipPrimary] = useState(null)
  const [tooltipSecondary, setTooltipSecondary] = useState(null)

  useEffect(() => {
    if (!tooltipTitle && overviewData.length > 0) {
      calculateTotalVolume()
    }
  }, [tooltipTitle, overviewData])

  const calculateTotalVolume = () => {
    const totalPrimary = overviewData.reduce((a, b) => {
      return a + b.primarySales
    }, 0)
    const totalSecondary = overviewData.reduce((a, b) => {
      return a + b.secondarySales
    }, 0)
    setTooltipTitle(`${totalPrimary + totalSecondary} TXs`)
    setTooltipPrimary(totalPrimary)
    setTooltipSecondary(totalSecondary)
  }

  return (
    <div className="h-60 relative">
      {tooltipTitle && (
        <div>
          <div>Volume</div>
          <div>{tooltipTitle}</div>
          <div>{tooltipPrimary}</div>
          <div>{tooltipSecondary}</div>
        </div>
      )}

      {overviewData.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={overviewData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            onMouseLeave={() => {
              setTooltipTitle(null)
              setTooltipPrimary(null)
              setTooltipSecondary(null)
            }}
          >
            <XAxis dataKey="name" />
            <Tooltip
              contentStyle={{ display: 'none' }}
              formatter={(value, name, props) => {
                if (name === 'primarySales' && tooltipPrimary != value) {
                  setTooltipTitle(
                    `${
                      props.payload.primarySales + props.payload.secondarySales
                    } TXs`
                  )
                  setTooltipPrimary(props.payload.primarySales)
                  setTooltipSecondary(props.payload.secondarySales)
                }
              }}
            />
            <Bar dataKey="primarySales" stackId="a" fill="#8884d8" />
            <Bar dataKey="secondarySales" stackId="a" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default TxChart
