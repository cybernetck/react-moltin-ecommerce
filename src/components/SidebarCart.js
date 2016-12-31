import React from 'react'
import events from '../vendor/pub-sub'
import moltin from '../vendor/moltin'
import _ from 'lodash/object'
import {Link} from 'react-router'

export default class SidebarCart extends React.Component {
	state = {
		currentCart : {
			total_items: null,
		}
	};

	componentDidMount() {
		let _this = this;

		moltin.Authenticate(function () {
			moltin.Cart.Contents(function(items) {
				_this.setState({
					currentCart: items
				})
			}, function(error) {
				// Something went wrong...
			});
		});

		// Listen to the ADD_TO_CART event
		events.subscribe('ADD_TO_CART', function() {
			// Once the new item is added to the cart, increase the number of total_items by one.
			// We could call the moltin.Cart.Contents() API function, but we want to reduce the number
			// of API calls as we are limited.
			moltin.Authenticate(function () {
				moltin.Cart.Contents(function(items) {
					_this.setState({
						currentCart: items
					})
				}, function(error) {
					// Something went wrong...
				});
			});
		});
	}

	render() {
		console.log(this.state.currentCart.contents);
		let cartContents = _.values(this.state.currentCart.contents);
		let preparedCartContents = cartContents.map((result, id) => {
			return(
				<div className="item" key={id}>
					<div className="ui tiny image">
						<img src={result.images[0].url.http} />
					</div>
					<div className="content">
						<span className="header">{result.name}</span>
						<div className="extra">
							<i className="euro icon"></i>{result.sale_price}
						</div>
					</div>
				</div>
			)
		});

		console.log(cartContents);

		return (
			<div className="sidebar-cart sidebar-element">
				<h4>In Cart <i className="in cart icon"></i></h4><Link to="/" className="ui button basic teal mini">Checkout</Link>
				<div className="ui items">
					{preparedCartContents}
				</div>
			</div>
		);
	}
}