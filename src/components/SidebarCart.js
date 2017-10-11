import React from 'react';
import events from '../vendor/pub-sub';
import { Moltin } from '../vendor/moltin';
import _ from 'lodash/object';
import {Link} from 'react-router';
import LoadingIcon from '../../public/ripple.svg';

export default class SidebarCart extends React.Component {
	
	state = {
		quantity: 0,
		currentCart : {
			data: {},
			meta : {
				display_price : {
					with_tax : {
						formatted: null
					}
				}
			}
		},
		addingToCart: false
	};

	componentDidMount() {
		let _this = this;

		// Initial content load of the cart content
		Moltin.Cart.Items()
			.then((items) => {

				var quantity = 0;

      			items.data.forEach(function(item) {
        		quantity += item.quantity;
      			})

				events.publish('CART_UPDATED', {
					cart: items, // any argument
					total: quantity
				});

				_this.setState({
					currentCart: items,
					total: quantity
				})

		}).catch((e) => {
			console.log(e);
		})

		// Listen to theCART_UPDATED event. Once it happens, take the object from the
		// published event and pass it to the currentCart state
		events.subscribe('CART_UPDATED', function(obj) {
			_this.setState({
				currentCart: obj.cart,
				quantity: obj.total
			});
		});

		// Listen to the ADD_TO_CART event
		events.subscribe('ADD_TO_CART', function(obj) {
			_this.setState({
				addingToCart: obj.adding
			});

			// Once it fires, get the latest cart content data
				Moltin.Cart.Items()

				.then((items) => {

					var quantity = 0;

	      			items.data.forEach(function(item) {
	        		quantity += item.quantity;
	      			})
									// Pass the new cart content to CART_UPDATED event
					events.publish('CART_UPDATED', {
						cart: items,
						total: quantity
					});

					_this.setState({
						currentCart: items
					})
					console.log(_this.state)
				}).catch((e) => {
					console.log(e)
				})
			})
	}

	render() {

		let preparedCartContent;
		let cartContent = _.values(this.state.currentCart.contents);
		// If the cart is not empty, display the cart items
		if (this.state.quantity >= 1) {
			preparedCartContent = cartContent.map((result, id) => {
				return(
					<div className="item" key={id}>
						<div className="ui tiny image">
							{
								(result.featured_small)
									// If we have an image set
									? <img src={result.featured_small.data.url.https} alt="featured" />

									//else put some placeholder
									: <img src="http://placehold.it/300x380" alt="featured placeholder" />
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
			<div className="sidebar-cart sidebar-element">
				<h4>In Cart: <span className="price">{this.state.currentCart.meta.display_price.with_tax.formatted}</span></h4>
				{/*// If the cart is not empty, add 'active' class to it*/}
				<Link to="/checkout" className={`ui checkout button tiny ${this.state.quant >= 1 ? 'active': ''}`}>
					<i className="paypal icon"></i>Checkout</Link>
				<div className="ui items">
					{preparedCartContent}
				</div>

				<img className={`loading-icon ${!this.state.addingToCart ? 'non-visible' : ''}`} src={LoadingIcon} alt="Loading"/>
			</div>
		);
	}
}
