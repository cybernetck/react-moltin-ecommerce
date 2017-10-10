import React, { Component } from 'react';
import { Moltin } from '../vendor/moltin';
import ProductList from './ProductList';
import Cover from './Cover';

class Home extends Component {
	state = {
		products: null,
		files: null,
		loaded: false
	};

	componentDidMount() {

		let _this = this;
		Moltin.Products.With(['files']).All()

		.then((products) => {
			_this.setState({
				products: products,
				files: products.included.files
			});

		}).catch((e) => {
			console.log(e);
		})
		
	}

	render() {
		if(this.state.products !== null) {
			return (
				<div className="home-intro">
					<Cover products={this.state.products} files={this.state.files} lastProduct={this.state.products.data[this.state.products.data.length - 1]}/>
					<ProductList products={this.state.products}/>
				</div>
			)
		} else {
			return (
				<div className="home-intro">
					<Cover/>
				</div>
				)
		}
	}
}

export default Home;
