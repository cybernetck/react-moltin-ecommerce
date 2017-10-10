import React from 'react'
import { Moltin } from '../vendor/moltin';
import ImageGallery from 'react-image-gallery';
import _ from 'lodash'
//import LoadingIcon from '../../public/ripple.svg';
import { Accordion, Icon } from 'semantic-ui-react';
import AddToCartButton from '../components/AddToCartButton'


export default class Product extends React.Component {
	state = {
		id: this.props.location.pathname.replace('/product/', ''), // remove string '/product/' from the url and use the id only
		loaded: false,
		images: [
				{
					url: ''
				}
			],
		product: {

			data: {
				name: null,
				description: null,
				meta: {
					display_price: {
						with_tax: {
							formatted: null
						}
					}
				}
			},
		},
		galleryLoaded: false
	};

	componentDidMount() {
		let _this = this;

		Moltin.Products.Get(_this.state.id).then((product) => {
  			_this.setState({
  				product: product
  			})
  		}).catch((e) => {
  			console.log(e);
  		});
	}


	render() {
			console.log(this.state);
		//initialize an empty gallery array.
		const gallery = [];
		let _this = this;

		// If we have images uploaded
		if (this.state.images.length >= 1 ) {
			let index = 0;

			_.forEach(this.state.images, function(value) {
				gallery[index] = {
					original: value.url.https,
					thumbnail: value.url.https
				};
				index++;

				// If the gallery is completely loaded
				if (index === _this.state.images.length) {
					_this.state.galleryLoaded = true;
				}
			});
		}

		else {
			gallery[0] = {
				original: 'https://placehold.it/1000x1000',
				thumbnail: 'https://placehold.it/100x100'
			}
		}


		return (
			<div className="product-container">
				<div className="top">
					<div className="ui grid">
						<div className="ten wide column">
							{/*<div className="overlay">*/}
							{/*<img src={LoadingIcon} alt="Loading"/>*/}
							{/*</div>*/}

							<div className="no-overflow">
								<ImageGallery
									thumbnailPosition={'left'}
									showNav={false}
									showPlayButton={false}
									slideOnThumbnailHover={true}
									items={gallery}
									slideInterval={2000}
									onImageLoad={this.handleImageLoad}
								/>
							</div>
						</div>
						<div className="six wide column">
							<div className="product-details">
								<h1>{this.state.product.data.name} <span className="price">{this.state.product.data.meta.display_price.with_tax.formatted}</span></h1>
								<AddToCartButton additionalClass="fluid ui button" productId={this.state.product.data.id}/>

								<Accordion styled defaultActiveIndex={0}>
									<Accordion.Title>
										<Icon name='dropdown' />
										Product Description
									</Accordion.Title>
									<Accordion.Content>
										<p>
											{this.state.product.data.description}
										</p>
									</Accordion.Content>
									<Accordion.Title>
										<Icon name='dropdown' />
										Delivery
									</Accordion.Title>
									<Accordion.Content>
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus at augue et risus scelerisque finibus nec vitae velit. Praesent consectetur nibh aliquet m
										</p>
									</Accordion.Content>
									<Accordion.Title>
										<Icon name='dropdown' />
										Components
									</Accordion.Title>
									<Accordion.Content>
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus at augue et risus scelerisque finibus nec vitae velit. Praesent consectetur nibh aliquet m
										</p>
									</Accordion.Content>
								</Accordion>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
