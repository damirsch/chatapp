import React, { type FC, useEffect, useState } from 'react'
import './Statistics.css'
import { Chart } from 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import { CategoryScale } from 'chart.js'
import Store from '../../forServer/store/store'
import { IAmountOfSentMessages } from '../../types'
import options from './options'
Chart.register(CategoryScale)

interface IStatistics{
	store: Store
}
const Statistics: FC<IStatistics> = ({ store }) => {
	const [amountOfSentMessages, setAmountOfSentMessages] = useState<IAmountOfSentMessages[]>([])
	const [chartData, setChartData] = useState<any>()
	
	useEffect(() => {
		(async () => {
			const res = await store.getAmountOfSentMessages()
			res.data.map(i => {
				const date = new Date(i.time)
				i.time = date.toLocaleString('en', {month: 'short'}) + ' ' 
					+ date.toLocaleString('en', {day: 'numeric'})
			})
			setAmountOfSentMessages(res.data)
			res.data = res.data.sort((a, b) => {
				return parseInt(a.time.replace(/[^\d]/g, '')) - parseInt(b.time.replace(/[^\d]/g, ''))
			})
			setChartData({
				labels: res.data.map((data) => data.time), 
				datasets: [
					{
						label: "Number of messages sent",
						data: res.data.map((data) => data.amount),
						borderColor: '#e8e8e8',
						backgroundColor: '#2c2c2c',
						borderWidth: 2
					}
				],
				backgroundColor: '#01d',
			})
		})()
	}, [])
	return (
		<div className='statistics'>
			{chartData ? 
				<div style={{width: '800px'}}>
					<Line data={chartData} options={options}/>
				</div> 
				: null
			}
			{amountOfSentMessages ?
				<div style={{display: 'flex', width: '400px'}}>
						{amountOfSentMessages.map(i => {
							return(
								<div key={i.time}>{i.time}: {i.amount}</div>
							)
						})}
				</div>
				: null
			}
		</div>
	)
}

export default Statistics