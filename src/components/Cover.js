import React from 'react';
import { Moltin } from '../vendor/moltin';
import {Link} from 'react-router';
import LoadingIcon from '../../public/ripple.svg';
//import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AddToCartButton from '../components/AddToCartButton';
import config from '../vendor/config'

export default class Cover extends React.Component {
	state = {
		products: null,
		files: null,
		lastProduct : {
			featured_large : {
				value: '',
				data : {
					url : {
						http: '',
						https: ''
					}
				}
			},
			price : {
				value: ''
			}
		},
		featured_category: config.featuredCategoryId, // ID of the category we use in the FEATURED section of the site,
		adding: false,
		featuredAcquired: false
	};

	componentDidMount() {
		let _this = this;

		// Get the featured product
			Moltin.Products.With(['files']).All()
			.then ((products) => {
				_this.setState({
					products : products.data, // all the products from the category
					files : products.included.files,
					lastProduct: products.data[products.data.length - 1], // since we display only one item, let's take the newest one
					featuredAcquired: true // The featured product is loaded
				});
			}).catch((e) => {
				console.log(e);
			})	
	}

	render() {
		
		let backgroundImage;

		if(this.props.products) {
			backgroundImage = {
				backgroundImage: 'url(' + this.props.files[0].link.href + ')',
			};
		}

		return (
			<div className="cover" style={backgroundImage}>
				<div className={`overlay ${this.state.featuredAcquired ? 'non-visible' : ''}`}>
					<img src={LoadingIcon} alt="Loading"/>
				</div>
				<div className="cover-inner">
					<div className="content">
						<div className="inner">
							<h1>{this.state.lastProduct.name}</h1>
							<p>{this.state.lastProduct.description}</p>
							<span className="price">
							{this.state.lastProduct.price.value}
						</span>

							<AddToCartButton additionalClass="inverted" productId={this.state.lastProduct.id}/>
							<Link className="ui inverted button" to={`/product/${this.state.lastProduct.id}`}>Details</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
