import React from 'react'
import { Moltin } from '../vendor/moltin';
import events from '../vendor/pub-sub'


export default class AddToCart extends React.Component {
	state = {
		adding: false
	};

	addToCart = (clicked) => {
		let _this = this;
		// Fire ADD_TO_CART immediately after user initiate the action
		events.publish('ADD_TO_CART', {
			adding: true
		});

		this.setState({
			clickedId: clicked,
			adding: true
		});

			Moltin.Cart.AddProduct(clicked, 1).then((cart) => {

				// Inform other listeners that ADD_TO_CART event is complete
				events.publish('ADD_TO_CART', {
					adding: false
				});

				// We use this info in the component itself
				_this.setState({
					adding: false
				})


			}).catch((e) => {
				_this.setState({
					adding: false
				})
				console.log(e);
			})
	};


	render() {
		return (
			<button className={`ui button ${this.props.additionalClass} ${this.state.adding ? 'disabled' : ''}`} onClick={() => { this.addToCart(this.props.productId)}}>
				<i className="add to cart icon"></i> Add to Cart
			</button>
		);
	}
}
