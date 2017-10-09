import React, { Component } from 'react'
//import Moltin from '../vendor/moltin';
import PaymentForm from '../components/PaymentForm'
import CartDetails from '../components/CartDetails'

export default class Checkout extends Component {
	render() {

		return (
			<div className="checkout-container">
				<div className="ui grid">
					<div className="seven wide column">
						<PaymentForm/>
					</div>
					<div className="nine wide column pt-n pb-n">
						<CartDetails/>
					</div>
				</div>
			</div>
		);
	}
}
