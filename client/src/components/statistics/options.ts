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
			}
		},
		y: {
			grid: {
				color: '#2c2c2c'
			}
		}
	}
}

export default options