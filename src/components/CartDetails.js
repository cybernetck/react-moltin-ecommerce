import React, { Component } from 'react';
import events from '../vendor/pub-sub';
import _ from 'lodash/object';

export default class CartDetails extends React.Component {
	state = {
		currentCart : {
			total_items: 0,
			contents: {}
		},
		addingToCart: false
	};

	componentDidMount() {
		let _this = this;
		// Listen to the CART_UPDATED event
		events.subscribe('CART_UPDATED', function(obj) {
			_this.state.currentCart = obj.cart;
		});
	}

	render() {
		let preparedCartContent;
		let cartContent = _.values(this.state.currentCart.contents);
		console.log(this.state.currentCart.contents);

		// If the cart is not empty, display the cart items
		if (this.state.currentCart.total_items >= 1) {
			preparedCartContent = cartContent.map((result, id) => {
				return(
					<div className="item" key={id}>
						<div className="ui tiny image">
							{
								(result.featured_small)
									// If we have an image set
									? <img src={result.featured_small.data.url.https} />

									//else put some placeholder
									: <img src="http://placehold.it/300x380" />
							}
						</div>
						<div className="content">
							<span className="header">{result.name} <br/><span className="price">{result.pricing.formatted.with_tax}</span></span>
						</div>
					</div>
				)
			});
		}

		// If the cart is empty, display the message
		else {
			preparedCartContent = (
				<span className="empty">
					The Cart is empty
				</span>
			);
		}

		return (
			<div className="cart-details">
				{preparedCartContent}
				<div className="ui items">
					<div className="item">
						<div className="ui tiny image">
							<img src="http://placehold.it/50x50" />
						</div>

						<div className="middle aligned content">
							<a className="header">12 Years a Slave</a>
							<span className="price">$10.00</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}