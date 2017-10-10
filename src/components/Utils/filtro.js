import React, { Component } from 'react';
import * as d3 from 'd3';

class Filtro extends Component {
	filtrar = evt => {
		d3.select('#cantidad').remove();
		d3.select('#positivas').remove();
		d3.select('#negativas').remove();
		d3.select('#x_axis').remove();
		d3.select('#y_axis').remove();
		this.props.cambiarGranularidad(evt.target.value);
	};

	render() {
		return (
			<div>
				Cambiar granularidad (minutos): &nbsp; &nbsp;
				<select
					style={{ width: '100px', height: '50px' }}
					onChange={this.filtrar}
					value={this.props.granularidad}>
					<option key={1} value={5}>
						5
					</option>
					<option key={2} value={10}>
						10
					</option>
					<option key={3} value={15}>
						15
					</option>
					<option key={4} value={20}>
						20
					</option>
					<option key={5} value={25}>
						25
					</option>
					<option key={6} value={30}>
						30
					</option>
					<option key={7} value={35}>
						35
					</option>
					<option key={8} value={40}>
						40
					</option>
				</select>
			</div>
		);
	}
}

export default Filtro;
