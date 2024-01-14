const options = {
	hover:{
		includeInvisible: true
	},
	plugins: {
		legend: {
			labels: {
				font: {
					size: 20,
				}
			}
		},
		
	},
	layout: {
		padding:{
			left: 50
		}
	},
	scales: {
		x: {
			grid: {
				color: '#2c2c2c',
				lineWidth: 2
			},
			title: {
				display: true,
				text: 'Days',
			}
		},
		y: {
			grid: {
				color: '#2c2c2c'
			},
			title: {
				display: true,
				text: 'Amount of Messages',
			}
		},
	}
}

export default options