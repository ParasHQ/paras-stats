import axios from 'axios'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const resp = await axios.get(`/api/overview`)
    console.log(resp.data)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <p>Overview</p>
    </div>
  )
}
