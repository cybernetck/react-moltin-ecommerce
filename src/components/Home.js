import React, { Component } from 'react';
import { Moltin } from '../vendor/moltin';
import ProductList from './ProductList';
import Cover from './Cover';

class Home extends Component {
	state = {
		data: [],
		loaded: false
	};

	componentDidMount() {

		let _this = this;
			_this.setState({
				data: Moltin.Products.All()
			});
	}

	render() {
		console.log(this.state.data)
		return (
			<div className="home-intro">
				<Cover/>
				<ProductList products={this.state.data}/>
			</div>
		);
	}
}

export default Home;
