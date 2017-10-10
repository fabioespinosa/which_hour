import React, { Component } from 'react';
import * as d3 from 'd3';

import datos from '../data/data.csv';
import Titulo from './Titulo/Titulo';
import Chart from './visualizaciones/Chart';
import Filtro from './Utils/filtro';
import Explicacion from './Explicacion/Explicacion';

class App extends Component {
	state = { granularidad: 40 };

	componentWillMount() {
		d3.csv(datos, (err, datos) => {
			datos.forEach(d => {
				d.created_at_original = d.created_at;
				d.created_at = d3.timeParse('%H:%M:%S %p')(d.created_at);
			});
			this.setState({ datos });
		});
	}

	cambiarGranularidad = nuevaGranularidad => {
		this.setState({ granularidad: nuevaGranularidad });
	};

	render() {
		return (
			<div>
				<center>
					<Titulo />
					<Chart datos={this.state.datos} granularidad={this.state.granularidad} />
					<Filtro
						cambiarGranularidad={this.cambiarGranularidad}
						granularidad={this.state.granularidad}
					/>
					<Explicacion />
				</center>
			</div>
		);
	}
}

export default App;
