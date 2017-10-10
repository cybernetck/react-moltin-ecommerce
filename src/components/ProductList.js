import React from 'react';
import {Link} from 'react-router';
import AddToCartButton from '../components/AddToCartButton';
import ProductImage from '../components/ProductImage';

export default class Spotlight extends React.Component {
	state = {
		clickedId: '',
		adding: false,
	};

	render() {
		// Create allItems function from the props we get from Home component
		let allItems = this.props.products.data.map((result, id) => {
			return (
				<div key={id} className="column product-list-element">
					<div className="ui card" key={id}>
						<div className="image">
							<ProductImage product={result} products={this.props.products}/>
							
							<div className="extra content">
								<div className="buttons-container">
									<AddToCartButton productId={result.id} additionalClass="inverted"/>
									<Link className="ui inverted button" to={`/product/${result.id}`}>Details</Link>
								</div>
							</div>
						</div>
						<div className="content">
							<span className="header">{result.name}</span>
							<span className="sub">Collection Name</span>
							<div className="price">
								<span>{result.price.value}</span>
							</div>
						</div>
					</div>
				</div>
			);
		});

		return (
			<div className="spotlight-container">
				<div className="ui stackable three column grid">
					{allItems}
				</div>
			</div>
		);
	}
}
