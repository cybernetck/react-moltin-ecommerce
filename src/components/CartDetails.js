import React, { Component } from 'react';
import events from '../vendor/pub-sub';
import _ from 'lodash/object';
import { Moltin } from '../vendor/moltin';
import LoadingIcon from '../../public/ripple.svg';
import {Link} from 'react-router';

export default class CartDetails extends Component {
	state = {
		total: null,
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
		loaded: false,
		removing: false,
		products: {
			data: null
		}
	};

	componentDidMount() {
		let _this = this;

			Moltin.Products.With(['files']).All()
			.then((products) => {
			  	_this.setState({
			  		products: products
			  	})
			 }).catch((e) => {
			  	console.log(e);
			  });

				Moltin.Cart.Items().then((items) => {

					var quantity = 0;

	      			items.data.forEach(function(item) {
	        		quantity += item.quantity;
	      			})

					events.publish('CART_UPDATED', {
						cart: items, // any argument
						total: quantity
					});

					_this.setState({
						total: quantity,
						currentCart: items,
						loaded: true
					})
				}).catch((e) => {
					console.log(e);
				});
	}

	removeFromCart(clicked) {
		let _this = this;
		this.setState({
			removing: true
		});

		Moltin.Cart.RemoveItem(clicked)
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
						total: quantity,
						loaded: true,
						removing: false
					})
		}).catch((e) => {
			console.log(e);
		})
	};

	render() {
		let preparedCartContent;
		let cartContent = this.state.currentCart.data;

		var findProduct = (Productid, products) => {

			let product;
			let productData = products.data;
			let fileId;
			let file;

			product = productData.find(function (el) {
        		return Productid === el.id;
      		})

      		fileId = product.relationships.main_image.data.id;

      		file = this.state.products.included.main_images.find(function (el) {
         		return fileId === el.id
       	 	});

      		return <img src={file.link.href} role="presentation" />  || <img src='https://placeholdit.imgix.net/~text?txtsize=69&txt=824%C3%971050&w=824&h=1050' role="presentation" />
		}


		// If the cart is not empty, display the cart items
		if (this.state.total >= 1 && this.state.products.data !== null) {
			preparedCartContent = cartContent.map((result, id) => {

				return(
					<div className="item" key={id}>
						<div className="ui tiny image">
							{
	
								findProduct(result.product_id, this.state.products)

							}
						</div>
						<div className="content">
							<Link to={`/product/${result.id}`}>
								<span className="header">{result.name} <br/>
								<span className="price">{result.meta.display_price.with_tax.formatted}</span>
							</span>
							</Link>
						</div>

						<button  onClick={() => { this.removeFromCart(result.id)}} className={`remove ui button ${this.state.removing ? 'disabled' : ''}`}>
							<i className="remove outline icon"></i></button>
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
				<div className={`overlay ${this.state.loaded ? 'non-visible' : ''}`}>
					<img src={LoadingIcon} alt="Loading"/>
				</div>

				<div className="ui items">
					{preparedCartContent}

					<div className="total">
						<span className="text">TOTAL: </span>
						<span className="price">{this.state.currentCart.meta.display_price.with_tax.formatted}</span>
					</div>
				</div>
			</div>
		);
	}
}
