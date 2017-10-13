import React, { Component } from 'react';
import * as d3 from 'd3';

class Chart extends Component {
	state = {
		height: 500,
		width: 1300,
		margin_left: 200,
		margin_bottom: 50,
		margin_right: 200
	};
	//colocar etiquetas u anotaciones para saber valores especificos y hacer comparaciones
	shouldComponentUpdate(nextProps) {
		this.renderChart(nextProps);
		return false;
	}

	renderChart(props) {
		const { datos, granularidad } = props;
		const { height, width, margin_bottom, margin_left, margin_right } = this.state;

		const num_slots = 24 * (60 / granularidad) - 1;

		// data
		var svg = d3
			.select('svg')
			.attr('height', height)
			.attr('width', width);

		var parser = d3.timeParse('%H:%M:%S');
		var midnight = parser('00:00:01');
		var last_hour = parser('23:59:59');

		var categoryScale = d3
			.scaleTime()
			.domain([midnight, last_hour])
			.rangeRound([0, num_slots]); // Se usa una granularidad de 15 minutos

		// Se agregan las frecuencias de los intervalos a 'cuenta'
		var cuenta = [];

		for (var i = 0; i <= num_slots; i++) {
			cuenta[i] = { categoria: i, cantidad: 0, positivas: 0, negativas: 0 };
		}

		datos.map(d => {
			var num_actualizar = categoryScale(d.created_at);
			if (cuenta[num_actualizar]) {
				cuenta[num_actualizar] = {
					cantidad: cuenta[num_actualizar].cantidad + 1,
					positivas:
						d.aprueba === 'TRUE'
							? cuenta[num_actualizar].positivas + 1
							: cuenta[num_actualizar].positivas,
					negativas:
						d.aprueba === 'FALSE'
							? cuenta[num_actualizar].negativas + 1
							: cuenta[num_actualizar].negativas,
					categoria: num_actualizar
				};
			}
		});

		console.log(cuenta);

		var yMax = d3.max(cuenta, d => d.cantidad);

		var yScale = d3
			.scaleLinear()
			.domain([0, yMax])
			.range([height - margin_bottom, 0]);

		var xScale = d3
			.scaleLinear()
			.domain([0, num_slots])
			.range([0 + margin_left, width - margin_right]);

		// Cantidad
		var cantidad = d3
			.line()
			.x(d => xScale(d.categoria))
			.y(d => yScale(d.cantidad));

		// data
		svg
			.append('path')
			.datum(cuenta)
			.attr('id', 'cantidad')
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('d', cantidad);

		// positivas
		var line_positivas = d3
			.line()
			.x(d => xScale(d.categoria))
			.y(d => yScale(d.positivas));

		svg
			.append('path')
			.datum(cuenta)
			.attr('id', 'positivas')
			.attr('fill', 'none')
			.attr('stroke', 'green')
			.attr('d', line_positivas);

		// negativas
		var line_negativas = d3
			.line()
			.x(d => xScale(d.categoria))
			.y(d => yScale(d.negativas));

		svg
			.append('path')
			.datum(cuenta)
			.attr('id', 'negativas')
			.attr('fill', 'none')
			.attr('stroke', 'red')
			.attr('d', line_negativas);

		var yAxis = d3.axisLeft().scale(yScale);

		svg
			.append('g')
			.attr('id', 'y_axis')
			.attr('transform', `translate(${margin_left}, 0)`)
			.call(yAxis);

		var auxiliaryScale = d3
			.scaleTime()
			.domain([midnight, last_hour])
			.range([0 + margin_left, width - margin_right]);

		var xAxis = d3.axisBottom().scale(auxiliaryScale);

		svg
			.append('g')
			.attr('id', 'x_axis')
			.attr('transform', `translate(0, ${height - margin_bottom})`)
			.call(xAxis.ticks(24));
	}

	render() {
		return (
			<div>
				<svg ref="container" className="" />
			</div>
		);
	}
}

export default Chart;
