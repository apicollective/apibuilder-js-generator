import ComponentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import DataTypes from '@data-driven-forms/react-form-renderer/dist/cjs/data-types';
import ValidatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import Schema from '@data-driven-forms/react-form-renderer/dist/cjs/schema';

export const AttributeForm = {
	name: 'attribute_form',
	fields: [
		{
			label: 'Key',
			name: 'key',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Options',
			name: 'options',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Required',
					name: 'options.required',
					dataType: DataTypes.BOOLEAN,
					component: ComponentTypes.SWITCH,
					type: 'boolean',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Show in catalog',
					name: 'options.show_in_catalog',
					dataType: DataTypes.BOOLEAN,
					component: ComponentTypes.SWITCH,
					type: 'boolean',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Show in harmonization',
					name: 'options.show_in_harmonization',
					dataType: DataTypes.BOOLEAN,
					component: ComponentTypes.SWITCH,
					type: 'boolean',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Label',
			name: 'label',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Intent',
			name: 'intent',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Brand', value: 'brand' },
				{ label: 'Color', value: 'color' },
				{ label: 'Countries of origin', value: 'countries_of_origin' },
				{ label: 'Product id', value: 'product_id' },
				{ label: 'Fulfillment method', value: 'fulfillment_method' },
				{ label: 'Hazardous', value: 'hazardous' },
				{ label: 'Price', value: 'price' },
				{ label: 'Size', value: 'size' },
				{ label: 'Sku', value: 'sku' },
				{ label: 'Taxability', value: 'taxability' },
				{ label: 'Consumer url', value: 'consumer_url' },
				{ label: 'Gtin', value: 'gtin' },
				{ label: 'Mpn', value: 'mpn' },
				{ label: 'Facet', value: 'facet' },
				{ label: 'Eccn', value: 'eccn' }
			]
		},
		{
			label: 'Type',
			name: 'type',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Boolean', value: 'boolean' },
				{ label: 'Decimal', value: 'decimal' },
				{ label: 'String', value: 'string' },
				{ label: 'Json array', value: 'json_array' }
			]
		},
		{
			label: 'Position',
			name: 'position',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		}
	]
} as Schema;

export const CheckoutAttributeForm = {
	name: 'checkout_attribute_form',
	fields: [
		{
			label: 'Key',
			name: 'key',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Experience key',
			name: 'experience_key',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Attribute keys',
			name: 'attribute_keys',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Position',
			name: 'position',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		}
	]
} as Schema;

export const CreditPaymentForm = {
	name: 'credit_payment_form',
	fields: [
		{
			label: 'Order number',
			name: 'order_number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Description',
			name: 'description',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Amount',
			name: 'amount',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Max',
			name: 'max',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const DiscountRuleSettingsForm = {
	name: 'discount_rule_settings_form',
	fields: [
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'From with tz',
			name: 'from_with_tz',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Datetime',
					name: 'from_with_tz.datetime',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Timezone',
					name: 'from_with_tz.timezone',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'To with tz',
			name: 'to_with_tz',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Datetime',
					name: 'to_with_tz.datetime',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Timezone',
					name: 'to_with_tz.timezone',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Experience keys',
			name: 'experience_keys',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Rule',
			name: 'rule',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Offers',
					name: 'rule.offers',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [
						{
							label: 'Discount: Union type not supported',
							name: 'discount',
							component: ComponentTypes.PLAIN_TEXT
						},
						{
							label: 'Entitlement: Union type not supported',
							name: 'entitlement',
							component: ComponentTypes.PLAIN_TEXT
						}
					],
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		}
	]
} as Schema;

export const ExperienceForm = {
	name: 'experience_form',
	fields: [
		{
			label: 'Region id',
			name: 'region_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Delivered duty',
			name: 'delivered_duty',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Paid', value: 'paid' },
				{ label: 'Unpaid', value: 'unpaid' }
			]
		},
		{
			label: 'Country',
			name: 'country',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Language',
			name: 'language',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Key',
			name: 'key',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Measurement system',
			name: 'measurement_system',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Imperial', value: 'imperial' },
				{ label: 'Metric', value: 'metric' }
			]
		},
		{
			label: 'Subcatalog id',
			name: 'subcatalog_id',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const ExperienceCurrencyFormatForm = {
	name: 'experience_currency_format_form',
	fields: [
		{
			label: 'Symbol',
			name: 'symbol',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Narrow', value: 'narrow' },
				{ label: 'Primary', value: 'primary' }
			]
		},
		{
			label: 'Label formatters: Array of enum type not supported',
			name: 'label_formatters',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const ItemMarginPostForm = {
	name: 'item_margin_post_form',
	fields: [
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Q',
			name: 'q',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Key',
			name: 'key',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Fixed',
			name: 'fixed',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		},
		{
			label: 'Percent',
			name: 'percent',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		},
		{
			label: 'Position',
			name: 'position',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		}
	]
} as Schema;

export const ItemMarginPutForm = {
	name: 'item_margin_put_form',
	fields: [
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Q',
			name: 'q',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Fixed',
			name: 'fixed',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		},
		{
			label: 'Percent',
			name: 'percent',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		},
		{
			label: 'Position',
			name: 'position',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		}
	]
} as Schema;

export const ExperiencePriceBookMappingForm = {
	name: 'experience_price_book_mapping_form',
	fields: [
		{
			label: 'Price book key',
			name: 'price_book_key',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Position',
			name: 'position',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		}
	]
} as Schema;

export const ExperiencePriceBookMappingPutForm = {
	name: 'experience_price_book_mapping_put_form',
	fields: [
		{
			label: 'Price books',
			name: 'price_books',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Price book key',
					name: 'price_book_key',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Position',
					name: 'position',
					dataType: DataTypes.INTEGER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number'
				}
			],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ExperienceCloneForm = {
	name: 'experience_clone_form',
	fields: [
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const Pricing = {
	name: 'pricing',
	fields: [
		{
			label: 'Vat',
			name: 'vat',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Included', value: 'included' },
				{ label: 'Displayed', value: 'displayed' },
				{ label: 'Ignored', value: 'ignored' }
			]
		},
		{
			label: 'Duty',
			name: 'duty',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Included', value: 'included' },
				{ label: 'Displayed', value: 'displayed' },
				{ label: 'Ignored', value: 'ignored' }
			]
		},
		{
			label: 'Rounding',
			name: 'rounding',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Type',
					name: 'rounding.type',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Pattern', value: 'pattern' },
						{ label: 'Multiple', value: 'multiple' }
					]
				},
				{
					label: 'Method',
					name: 'rounding.method',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Up', value: 'up' },
						{ label: 'Down', value: 'down' },
						{ label: 'Nearest', value: 'nearest' }
					]
				},
				{
					label: 'Value',
					name: 'rounding.value',
					dataType: DataTypes.NUMBER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		}
	]
} as Schema;

export const ExperienceStatusForm = {
	name: 'experience_status_form',
	fields: [
		{
			label: 'Status',
			name: 'status',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Draft', value: 'draft' },
				{ label: 'Active', value: 'active' },
				{ label: 'Archiving', value: 'archiving' },
				{ label: 'Archived', value: 'archived' }
			]
		}
	]
} as Schema;

export const ExperienceCheckoutSettingsForm = {
	name: 'experience_checkout_settings_form',
	fields: [
		{
			label: 'Checkout configuration id',
			name: 'checkout_configuration_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ExperienceLogisticsSettingsPutForm = {
	name: 'experience_logistics_settings_put_form',
	fields: [
		{
			label: 'Shipping configuration key',
			name: 'shipping_configuration_key',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ItemForm = {
	name: 'item_form',
	fields: [
		{
			label: 'Number',
			name: 'number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Locale',
			name: 'locale',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Price',
			name: 'price',
			dataType: DataTypes.FLOAT,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Categories',
			name: 'categories',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
		},
		{
			label: 'Description',
			name: 'description',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Dimensions',
			name: 'dimensions',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Product',
					name: 'dimensions.product',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Depth',
							name: 'dimensions.product.depth',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.product.depth.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.product.depth.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Diameter',
							name: 'dimensions.product.diameter',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.product.diameter.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.product.diameter.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Length',
							name: 'dimensions.product.length',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.product.length.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.product.length.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Weight',
							name: 'dimensions.product.weight',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.product.weight.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.product.weight.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Width',
							name: 'dimensions.product.width',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.product.width.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.product.width.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						}
					]
				},
				{
					label: 'Packaging',
					name: 'dimensions.packaging',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Depth',
							name: 'dimensions.packaging.depth',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.packaging.depth.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.packaging.depth.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Diameter',
							name: 'dimensions.packaging.diameter',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.packaging.diameter.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.packaging.diameter.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Length',
							name: 'dimensions.packaging.length',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.packaging.length.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.packaging.length.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Weight',
							name: 'dimensions.packaging.weight',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.packaging.weight.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.packaging.weight.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Width',
							name: 'dimensions.packaging.width',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.packaging.width.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.packaging.width.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						}
					]
				}
			]
		},
		{
			label: 'Images',
			name: 'images',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Url',
					name: 'url',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Tags: Array of enum type not supported',
					name: 'tags',
					component: ComponentTypes.PLAIN_TEXT
				},
				{
					label: 'Attributes: Map type not supported',
					name: 'attributes',
					component: ComponentTypes.PLAIN_TEXT
				}
			]
		}
	]
} as Schema;

export const ItemPriceUpdatePutForm = {
	name: 'item_price_update_put_form',
	fields: [
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Price',
			name: 'price',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const ItemFormOverlayForm = {
	name: 'item_form_overlay_form',
	fields: [
		{
			label: 'Number',
			name: 'number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Price',
			name: 'price',
			dataType: DataTypes.FLOAT,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		},
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Position',
			name: 'position',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		},
		{
			label: 'Categories',
			name: 'categories',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
		},
		{
			label: 'Description',
			name: 'description',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Dimensions',
			name: 'dimensions',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Product',
					name: 'dimensions.product',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Depth',
							name: 'dimensions.product.depth',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.product.depth.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.product.depth.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Diameter',
							name: 'dimensions.product.diameter',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.product.diameter.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.product.diameter.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Length',
							name: 'dimensions.product.length',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.product.length.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.product.length.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Weight',
							name: 'dimensions.product.weight',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.product.weight.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.product.weight.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Width',
							name: 'dimensions.product.width',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.product.width.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.product.width.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						}
					]
				},
				{
					label: 'Packaging',
					name: 'dimensions.packaging',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Depth',
							name: 'dimensions.packaging.depth',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.packaging.depth.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.packaging.depth.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Diameter',
							name: 'dimensions.packaging.diameter',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.packaging.diameter.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.packaging.diameter.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Length',
							name: 'dimensions.packaging.length',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.packaging.length.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.packaging.length.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Weight',
							name: 'dimensions.packaging.weight',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.packaging.weight.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.packaging.weight.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Width',
							name: 'dimensions.packaging.width',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'dimensions.packaging.width.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'dimensions.packaging.width.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						}
					]
				}
			]
		},
		{
			label: 'Images',
			name: 'images',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Url',
					name: 'url',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Tags: Array of enum type not supported',
					name: 'tags',
					component: ComponentTypes.PLAIN_TEXT
				},
				{
					label: 'Attributes: Map type not supported',
					name: 'attributes',
					component: ComponentTypes.PLAIN_TEXT
				}
			]
		}
	]
} as Schema;

export const OrderForm = {
	name: 'order_form',
	fields: [
		{
			label: 'Customer',
			name: 'customer',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Name',
					name: 'customer.name',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'First',
							name: 'customer.name.first',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Last',
							name: 'customer.name.last',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Number',
					name: 'customer.number',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Phone',
					name: 'customer.phone',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Email',
					name: 'customer.email',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Address',
					name: 'customer.address',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Name',
							name: 'customer.address.name',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'First',
									name: 'customer.address.name.first',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Last',
									name: 'customer.address.name.last',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						},
						{
							label: 'Streets',
							name: 'customer.address.streets',
							component: ComponentTypes.FIELD_ARRAY,
							fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
						},
						{
							label: 'City',
							name: 'customer.address.city',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Province',
							name: 'customer.address.province',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Postal',
							name: 'customer.address.postal',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Country',
							name: 'customer.address.country',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Company',
							name: 'customer.address.company',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Invoice',
					name: 'customer.invoice',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Address',
							name: 'customer.invoice.address',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Name',
									name: 'customer.invoice.address.name',
									component: ComponentTypes.SUB_FORM,
									fields: [
										{
											label: 'First',
											name: 'customer.invoice.address.name.first',
											component: ComponentTypes.TEXT_FIELD
										},
										{
											label: 'Last',
											name: 'customer.invoice.address.name.last',
											component: ComponentTypes.TEXT_FIELD
										}
									]
								},
								{
									label: 'Streets',
									name: 'customer.invoice.address.streets',
									component: ComponentTypes.FIELD_ARRAY,
									fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
								},
								{
									label: 'City',
									name: 'customer.invoice.address.city',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Province',
									name: 'customer.invoice.address.province',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Postal',
									name: 'customer.invoice.address.postal',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Country',
									name: 'customer.invoice.address.country',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Company',
									name: 'customer.invoice.address.company',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						}
					]
				}
			]
		},
		{
			label: 'Items',
			name: 'items',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Number',
					name: 'number',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Quantity',
					name: 'quantity',
					dataType: DataTypes.INTEGER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Shipment estimate',
					name: 'shipment_estimate',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'From',
							name: 'shipment_estimate.from',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'To',
							name: 'shipment_estimate.to',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Price',
					name: 'price',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Amount',
							name: 'price.amount',
							dataType: DataTypes.FLOAT,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Currency',
							name: 'price.currency',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Attributes: Map type not supported',
					name: 'attributes',
					component: ComponentTypes.PLAIN_TEXT
				},
				{
					label: 'Center',
					name: 'center',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Discount',
					name: 'discount',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Amount',
							name: 'discount.amount',
							dataType: DataTypes.FLOAT,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Currency',
							name: 'discount.currency',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Discounts',
					name: 'discounts',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Discounts',
							name: 'discounts.discounts',
							component: ComponentTypes.FIELD_ARRAY,
							fields: [
								{
									label: 'Offer: Union type not supported',
									name: 'offer',
									component: ComponentTypes.PLAIN_TEXT
								},
								{
									label: 'Target',
									name: 'target',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Item', value: 'item' },
										{ label: 'Shipping', value: 'shipping' }
									]
								},
								{
									label: 'Label',
									name: 'label',
									component: ComponentTypes.TEXT_FIELD
								}
							],
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				}
			],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Delivered duty',
			name: 'delivered_duty',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Paid', value: 'paid' },
				{ label: 'Unpaid', value: 'unpaid' }
			]
		},
		{
			label: 'Number',
			name: 'number',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Destination',
			name: 'destination',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Text',
					name: 'destination.text',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Streets',
					name: 'destination.streets',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'City',
					name: 'destination.city',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Province',
					name: 'destination.province',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Postal',
					name: 'destination.postal',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Country',
					name: 'destination.country',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Latitude',
					name: 'destination.latitude',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Longitude',
					name: 'destination.longitude',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Contact',
					name: 'destination.contact',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Name',
							name: 'destination.contact.name',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'First',
									name: 'destination.contact.name.first',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Last',
									name: 'destination.contact.name.last',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						},
						{
							label: 'Company',
							name: 'destination.contact.company',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Email',
							name: 'destination.contact.email',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Phone',
							name: 'destination.contact.phone',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				}
			]
		},
		{
			label: 'Discount',
			name: 'discount',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Amount',
					name: 'discount.amount',
					dataType: DataTypes.FLOAT,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Currency',
					name: 'discount.currency',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Discounts',
			name: 'discounts',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Discounts',
					name: 'discounts.discounts',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [
						{
							label: 'Offer: Union type not supported',
							name: 'offer',
							component: ComponentTypes.PLAIN_TEXT
						},
						{
							label: 'Target',
							name: 'target',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Item', value: 'item' },
								{ label: 'Shipping', value: 'shipping' }
							]
						},
						{
							label: 'Label',
							name: 'label',
							component: ComponentTypes.TEXT_FIELD
						}
					],
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Authorization keys',
			name: 'authorization_keys',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
		},
		{
			label: 'Options',
			name: 'options',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Storage',
					name: 'options.storage',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Do not persist', value: 'do_not_persist' },
						{ label: 'Persist', value: 'persist' }
					]
				}
			]
		}
	]
} as Schema;

export const OrderWithDiscountsForm = {
	name: 'order_with_discounts_form',
	fields: [
		{
			label: 'Order',
			name: 'order',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Customer',
					name: 'order.customer',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Name',
							name: 'order.customer.name',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'First',
									name: 'order.customer.name.first',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Last',
									name: 'order.customer.name.last',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						},
						{
							label: 'Number',
							name: 'order.customer.number',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Phone',
							name: 'order.customer.phone',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Email',
							name: 'order.customer.email',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Address',
							name: 'order.customer.address',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Name',
									name: 'order.customer.address.name',
									component: ComponentTypes.SUB_FORM,
									fields: [
										{
											label: 'First',
											name: 'order.customer.address.name.first',
											component: ComponentTypes.TEXT_FIELD
										},
										{
											label: 'Last',
											name: 'order.customer.address.name.last',
											component: ComponentTypes.TEXT_FIELD
										}
									]
								},
								{
									label: 'Streets',
									name: 'order.customer.address.streets',
									component: ComponentTypes.FIELD_ARRAY,
									fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
								},
								{
									label: 'City',
									name: 'order.customer.address.city',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Province',
									name: 'order.customer.address.province',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Postal',
									name: 'order.customer.address.postal',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Country',
									name: 'order.customer.address.country',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Company',
									name: 'order.customer.address.company',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						},
						{
							label: 'Invoice',
							name: 'order.customer.invoice',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Address',
									name: 'order.customer.invoice.address',
									component: ComponentTypes.SUB_FORM,
									fields: [
										{
											label: 'Name',
											name: 'order.customer.invoice.address.name',
											component: ComponentTypes.SUB_FORM,
											fields: [
												{
													label: 'First',
													name: 'order.customer.invoice.address.name.first',
													component: ComponentTypes.TEXT_FIELD
												},
												{
													label: 'Last',
													name: 'order.customer.invoice.address.name.last',
													component: ComponentTypes.TEXT_FIELD
												}
											]
										},
										{
											label: 'Streets',
											name: 'order.customer.invoice.address.streets',
											component: ComponentTypes.FIELD_ARRAY,
											fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
										},
										{
											label: 'City',
											name: 'order.customer.invoice.address.city',
											component: ComponentTypes.TEXT_FIELD
										},
										{
											label: 'Province',
											name: 'order.customer.invoice.address.province',
											component: ComponentTypes.TEXT_FIELD
										},
										{
											label: 'Postal',
											name: 'order.customer.invoice.address.postal',
											component: ComponentTypes.TEXT_FIELD
										},
										{
											label: 'Country',
											name: 'order.customer.invoice.address.country',
											component: ComponentTypes.TEXT_FIELD
										},
										{
											label: 'Company',
											name: 'order.customer.invoice.address.company',
											component: ComponentTypes.TEXT_FIELD
										}
									]
								}
							]
						}
					]
				},
				{
					label: 'Items',
					name: 'order.items',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [
						{
							label: 'Number',
							name: 'number',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Quantity',
							name: 'quantity',
							dataType: DataTypes.INTEGER,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Shipment estimate',
							name: 'shipment_estimate',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'From',
									name: 'shipment_estimate.from',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'To',
									name: 'shipment_estimate.to',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						},
						{
							label: 'Price',
							name: 'price',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Amount',
									name: 'price.amount',
									dataType: DataTypes.FLOAT,
									component: ComponentTypes.TEXT_FIELD,
									type: 'number',
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Currency',
									name: 'price.currency',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						},
						{
							label: 'Attributes: Map type not supported',
							name: 'attributes',
							component: ComponentTypes.PLAIN_TEXT
						},
						{
							label: 'Center',
							name: 'center',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Discount',
							name: 'discount',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Amount',
									name: 'discount.amount',
									dataType: DataTypes.FLOAT,
									component: ComponentTypes.TEXT_FIELD,
									type: 'number',
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Currency',
									name: 'discount.currency',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						},
						{
							label: 'Discounts',
							name: 'discounts',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Discounts',
									name: 'discounts.discounts',
									component: ComponentTypes.FIELD_ARRAY,
									fields: [
										{
											label: 'Offer: Union type not supported',
											name: 'offer',
											component: ComponentTypes.PLAIN_TEXT
										},
										{
											label: 'Target',
											name: 'target',
											component: ComponentTypes.SELECT,
											options: [
												{ label: 'Item', value: 'item' },
												{ label: 'Shipping', value: 'shipping' }
											]
										},
										{
											label: 'Label',
											name: 'label',
											component: ComponentTypes.TEXT_FIELD
										}
									],
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						}
					],
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Delivered duty',
					name: 'order.delivered_duty',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Paid', value: 'paid' },
						{ label: 'Unpaid', value: 'unpaid' }
					]
				},
				{
					label: 'Number',
					name: 'order.number',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Destination',
					name: 'order.destination',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Text',
							name: 'order.destination.text',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Streets',
							name: 'order.destination.streets',
							component: ComponentTypes.FIELD_ARRAY,
							fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
						},
						{
							label: 'City',
							name: 'order.destination.city',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Province',
							name: 'order.destination.province',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Postal',
							name: 'order.destination.postal',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Country',
							name: 'order.destination.country',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Latitude',
							name: 'order.destination.latitude',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Longitude',
							name: 'order.destination.longitude',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Contact',
							name: 'order.destination.contact',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Name',
									name: 'order.destination.contact.name',
									component: ComponentTypes.SUB_FORM,
									fields: [
										{
											label: 'First',
											name: 'order.destination.contact.name.first',
											component: ComponentTypes.TEXT_FIELD
										},
										{
											label: 'Last',
											name: 'order.destination.contact.name.last',
											component: ComponentTypes.TEXT_FIELD
										}
									]
								},
								{
									label: 'Company',
									name: 'order.destination.contact.company',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Email',
									name: 'order.destination.contact.email',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Phone',
									name: 'order.destination.contact.phone',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						}
					]
				},
				{
					label: 'Discount',
					name: 'order.discount',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Amount',
							name: 'order.discount.amount',
							dataType: DataTypes.FLOAT,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Currency',
							name: 'order.discount.currency',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Discounts',
					name: 'order.discounts',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Discounts',
							name: 'order.discounts.discounts',
							component: ComponentTypes.FIELD_ARRAY,
							fields: [
								{
									label: 'Offer: Union type not supported',
									name: 'offer',
									component: ComponentTypes.PLAIN_TEXT
								},
								{
									label: 'Target',
									name: 'target',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Item', value: 'item' },
										{ label: 'Shipping', value: 'shipping' }
									]
								},
								{
									label: 'Label',
									name: 'label',
									component: ComponentTypes.TEXT_FIELD
								}
							],
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Attributes: Map type not supported',
					name: 'order.attributes',
					component: ComponentTypes.PLAIN_TEXT
				},
				{
					label: 'Authorization keys',
					name: 'order.authorization_keys',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'Options',
					name: 'order.options',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Storage',
							name: 'order.options.storage',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Do not persist', value: 'do_not_persist' },
								{ label: 'Persist', value: 'persist' }
							]
						}
					]
				}
			]
		},
		{
			label: 'Discounts',
			name: 'discounts',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const OrderPutForm = {
	name: 'order_put_form',
	fields: [
		{
			label: 'Items',
			name: 'items',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Number',
					name: 'number',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Quantity',
					name: 'quantity',
					dataType: DataTypes.INTEGER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Shipment estimate',
					name: 'shipment_estimate',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'From',
							name: 'shipment_estimate.from',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'To',
							name: 'shipment_estimate.to',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Price',
					name: 'price',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Amount',
							name: 'price.amount',
							dataType: DataTypes.FLOAT,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Currency',
							name: 'price.currency',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Attributes: Map type not supported',
					name: 'attributes',
					component: ComponentTypes.PLAIN_TEXT
				},
				{
					label: 'Center',
					name: 'center',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Discount',
					name: 'discount',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Amount',
							name: 'discount.amount',
							dataType: DataTypes.FLOAT,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Currency',
							name: 'discount.currency',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Discounts',
					name: 'discounts',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Discounts',
							name: 'discounts.discounts',
							component: ComponentTypes.FIELD_ARRAY,
							fields: [
								{
									label: 'Offer: Union type not supported',
									name: 'offer',
									component: ComponentTypes.PLAIN_TEXT
								},
								{
									label: 'Target',
									name: 'target',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Item', value: 'item' },
										{ label: 'Shipping', value: 'shipping' }
									]
								},
								{
									label: 'Label',
									name: 'label',
									component: ComponentTypes.TEXT_FIELD
								}
							],
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				}
			],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Customer',
			name: 'customer',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Name',
					name: 'customer.name',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'First',
							name: 'customer.name.first',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Last',
							name: 'customer.name.last',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Number',
					name: 'customer.number',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Phone',
					name: 'customer.phone',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Email',
					name: 'customer.email',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Address',
					name: 'customer.address',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Name',
							name: 'customer.address.name',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'First',
									name: 'customer.address.name.first',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Last',
									name: 'customer.address.name.last',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						},
						{
							label: 'Streets',
							name: 'customer.address.streets',
							component: ComponentTypes.FIELD_ARRAY,
							fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
						},
						{
							label: 'City',
							name: 'customer.address.city',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Province',
							name: 'customer.address.province',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Postal',
							name: 'customer.address.postal',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Country',
							name: 'customer.address.country',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Company',
							name: 'customer.address.company',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Invoice',
					name: 'customer.invoice',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Address',
							name: 'customer.invoice.address',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Name',
									name: 'customer.invoice.address.name',
									component: ComponentTypes.SUB_FORM,
									fields: [
										{
											label: 'First',
											name: 'customer.invoice.address.name.first',
											component: ComponentTypes.TEXT_FIELD
										},
										{
											label: 'Last',
											name: 'customer.invoice.address.name.last',
											component: ComponentTypes.TEXT_FIELD
										}
									]
								},
								{
									label: 'Streets',
									name: 'customer.invoice.address.streets',
									component: ComponentTypes.FIELD_ARRAY,
									fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
								},
								{
									label: 'City',
									name: 'customer.invoice.address.city',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Province',
									name: 'customer.invoice.address.province',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Postal',
									name: 'customer.invoice.address.postal',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Country',
									name: 'customer.invoice.address.country',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Company',
									name: 'customer.invoice.address.company',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						}
					]
				}
			]
		},
		{
			label: 'Delivered duty',
			name: 'delivered_duty',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Paid', value: 'paid' },
				{ label: 'Unpaid', value: 'unpaid' }
			]
		},
		{
			label: 'Selections',
			name: 'selections',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
		},
		{
			label: 'Destination',
			name: 'destination',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Text',
					name: 'destination.text',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Streets',
					name: 'destination.streets',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'City',
					name: 'destination.city',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Province',
					name: 'destination.province',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Postal',
					name: 'destination.postal',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Country',
					name: 'destination.country',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Latitude',
					name: 'destination.latitude',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Longitude',
					name: 'destination.longitude',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Contact',
					name: 'destination.contact',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Name',
							name: 'destination.contact.name',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'First',
									name: 'destination.contact.name.first',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Last',
									name: 'destination.contact.name.last',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						},
						{
							label: 'Company',
							name: 'destination.contact.company',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Email',
							name: 'destination.contact.email',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Phone',
							name: 'destination.contact.phone',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				}
			]
		},
		{
			label: 'Discount',
			name: 'discount',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Amount',
					name: 'discount.amount',
					dataType: DataTypes.FLOAT,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Currency',
					name: 'discount.currency',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Discounts',
			name: 'discounts',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Discounts',
					name: 'discounts.discounts',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [
						{
							label: 'Offer: Union type not supported',
							name: 'offer',
							component: ComponentTypes.PLAIN_TEXT
						},
						{
							label: 'Target',
							name: 'target',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Item', value: 'item' },
								{ label: 'Shipping', value: 'shipping' }
							]
						},
						{
							label: 'Label',
							name: 'label',
							component: ComponentTypes.TEXT_FIELD
						}
					],
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Authorization keys',
			name: 'authorization_keys',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
		},
		{
			label: 'Options',
			name: 'options',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Storage',
					name: 'options.storage',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Do not persist', value: 'do_not_persist' },
						{ label: 'Persist', value: 'persist' }
					]
				}
			]
		}
	]
} as Schema;

export const OrderDestinationPutForm = {
	name: 'order_destination_put_form',
	fields: [
		{
			label: 'Destination',
			name: 'destination',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Text',
					name: 'destination.text',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Streets',
					name: 'destination.streets',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'City',
					name: 'destination.city',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Province',
					name: 'destination.province',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Postal',
					name: 'destination.postal',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Country',
					name: 'destination.country',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Latitude',
					name: 'destination.latitude',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Longitude',
					name: 'destination.longitude',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Contact',
					name: 'destination.contact',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Name',
							name: 'destination.contact.name',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'First',
									name: 'destination.contact.name.first',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Last',
									name: 'destination.contact.name.last',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						},
						{
							label: 'Company',
							name: 'destination.contact.company',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Email',
							name: 'destination.contact.email',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Phone',
							name: 'destination.contact.phone',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				}
			]
		}
	]
} as Schema;

export const FreeShippingOrderPromotionForm = {
	name: 'free_shipping_order_promotion_form',
	fields: [
		{
			label: 'Trigger',
			name: 'trigger',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Type',
					name: 'trigger.type',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Automatic', value: 'automatic' },
						{ label: 'Order subtotal', value: 'order_subtotal' }
					]
				},
				{
					label: 'Min',
					name: 'trigger.min',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Amount',
							name: 'trigger.min.amount',
							dataType: DataTypes.FLOAT,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Currency',
							name: 'trigger.min.currency',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				}
			]
		},
		{
			label: 'Max',
			name: 'max',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Amount',
					name: 'max.amount',
					dataType: DataTypes.FLOAT,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Currency',
					name: 'max.currency',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const OrderServiceChangeForm = {
	name: 'order_service_change_form',
	fields: [
		{
			label: 'From service id',
			name: 'from_service_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'To service id',
			name: 'to_service_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const OrderSubmissionForm = {
	name: 'order_submission_form',
	fields: [
		{
			label: 'Identifiers',
			name: 'identifiers',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Identifier',
					name: 'identifier',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Name',
					name: 'name',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Primary',
					name: 'primary',
					dataType: DataTypes.BOOLEAN,
					component: ComponentTypes.SWITCH,
					type: 'boolean'
				}
			]
		}
	]
} as Schema;

export const TaxRegistrationForm = {
	name: 'tax_registration_form',
	fields: [
		{
			label: 'Number',
			name: 'number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Company name',
			name: 'company_name',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const OrderBuilderAttributesForm = {
	name: 'order_builder_attributes_form',
	fields: [
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const OrderBuilderDestinationCountryForm = {
	name: 'order_builder_destination_country_form',
	fields: [
		{
			label: 'Country',
			name: 'country',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const OrderBuilderDestinationForm = {
	name: 'order_builder_destination_form',
	fields: [
		{
			label: 'Destination',
			name: 'destination',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Text',
					name: 'destination.text',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Streets',
					name: 'destination.streets',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'City',
					name: 'destination.city',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Province',
					name: 'destination.province',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Postal',
					name: 'destination.postal',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Country',
					name: 'destination.country',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Latitude',
					name: 'destination.latitude',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Longitude',
					name: 'destination.longitude',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Contact',
					name: 'destination.contact',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Name',
							name: 'destination.contact.name',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'First',
									name: 'destination.contact.name.first',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Last',
									name: 'destination.contact.name.last',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						},
						{
							label: 'Company',
							name: 'destination.contact.company',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Email',
							name: 'destination.contact.email',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Phone',
							name: 'destination.contact.phone',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				}
			]
		}
	]
} as Schema;

export const OrderBuilderDeliveredDutyForm = {
	name: 'order_builder_delivered_duty_form',
	fields: [
		{
			label: 'Delivered duty',
			name: 'delivered_duty',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Paid', value: 'paid' },
				{ label: 'Unpaid', value: 'unpaid' }
			]
		}
	]
} as Schema;

export const OrderBuilderCustomerInvoiceAddressForm = {
	name: 'order_builder_customer_invoice_address_form',
	fields: [
		{
			label: 'Address',
			name: 'address',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Name',
					name: 'address.name',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'First',
							name: 'address.name.first',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Last',
							name: 'address.name.last',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Streets',
					name: 'address.streets',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'City',
					name: 'address.city',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Province',
					name: 'address.province',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Postal',
					name: 'address.postal',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Country',
					name: 'address.country',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Company',
					name: 'address.company',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		}
	]
} as Schema;

export const OrderEstimateForm = {
	name: 'order_estimate_form',
	fields: [
		{
			label: 'Items',
			name: 'items',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Number',
					name: 'number',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Quantity',
					name: 'quantity',
					dataType: DataTypes.INTEGER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Shipment estimate',
					name: 'shipment_estimate',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'From',
							name: 'shipment_estimate.from',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'To',
							name: 'shipment_estimate.to',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Price',
					name: 'price',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Amount',
							name: 'price.amount',
							dataType: DataTypes.FLOAT,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Currency',
							name: 'price.currency',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Attributes: Map type not supported',
					name: 'attributes',
					component: ComponentTypes.PLAIN_TEXT
				},
				{
					label: 'Center',
					name: 'center',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Discount',
					name: 'discount',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Amount',
							name: 'discount.amount',
							dataType: DataTypes.FLOAT,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Currency',
							name: 'discount.currency',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Discounts',
					name: 'discounts',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Discounts',
							name: 'discounts.discounts',
							component: ComponentTypes.FIELD_ARRAY,
							fields: [
								{
									label: 'Offer: Union type not supported',
									name: 'offer',
									component: ComponentTypes.PLAIN_TEXT
								},
								{
									label: 'Target',
									name: 'target',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Item', value: 'item' },
										{ label: 'Shipping', value: 'shipping' }
									]
								},
								{
									label: 'Label',
									name: 'label',
									component: ComponentTypes.TEXT_FIELD
								}
							],
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				}
			],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Destination',
			name: 'destination',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Text',
					name: 'destination.text',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Streets',
					name: 'destination.streets',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'City',
					name: 'destination.city',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Province',
					name: 'destination.province',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Postal',
					name: 'destination.postal',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Country',
					name: 'destination.country',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Latitude',
					name: 'destination.latitude',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Longitude',
					name: 'destination.longitude',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Contact',
					name: 'destination.contact',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Name',
							name: 'destination.contact.name',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'First',
									name: 'destination.contact.name.first',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Last',
									name: 'destination.contact.name.last',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						},
						{
							label: 'Company',
							name: 'destination.contact.company',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Email',
							name: 'destination.contact.email',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Phone',
							name: 'destination.contact.phone',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				}
			]
		},
		{
			label: 'Selections',
			name: 'selections',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
		}
	]
} as Schema;

export const OrderIdentifierForm = {
	name: 'order_identifier_form',
	fields: [
		{
			label: 'Order',
			name: 'order',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Identifier',
			name: 'identifier',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Number',
			name: 'number',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Primary',
			name: 'primary',
			dataType: DataTypes.BOOLEAN,
			component: ComponentTypes.SWITCH,
			type: 'boolean'
		}
	]
} as Schema;

export const OrderIdentifierPutForm = {
	name: 'order_identifier_put_form',
	fields: [
		{
			label: 'Order',
			name: 'order',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Primary',
			name: 'primary',
			dataType: DataTypes.BOOLEAN,
			component: ComponentTypes.SWITCH,
			type: 'boolean'
		}
	]
} as Schema;

export const OrganizationForm = {
	name: 'organization_form',
	fields: [
		{
			label: 'Id',
			name: 'id',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Environment',
			name: 'environment',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Sandbox', value: 'sandbox' },
				{ label: 'Production', value: 'production' }
			]
		},
		{
			label: 'Parent id',
			name: 'parent_id',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Defaults',
			name: 'defaults',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Country',
					name: 'defaults.country',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Base currency',
					name: 'defaults.base_currency',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Language',
					name: 'defaults.language',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Locale',
					name: 'defaults.locale',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Timezone',
					name: 'defaults.timezone',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		}
	]
} as Schema;

export const OrganizationPutForm = {
	name: 'organization_put_form',
	fields: [
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Environment',
			name: 'environment',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Sandbox', value: 'sandbox' },
				{ label: 'Production', value: 'production' }
			]
		},
		{
			label: 'Parent id',
			name: 'parent_id',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Defaults',
			name: 'defaults',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Country',
					name: 'defaults.country',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Base currency',
					name: 'defaults.base_currency',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Language',
					name: 'defaults.language',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Locale',
					name: 'defaults.locale',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Timezone',
					name: 'defaults.timezone',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		}
	]
} as Schema;

export const RegionSettingForm = {
	name: 'region_setting_form',
	fields: [
		{
			label: 'Status',
			name: 'status',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Enabled', value: 'enabled' },
				{ label: 'Disabled', value: 'disabled' }
			]
		}
	]
} as Schema;

export const PriceBookForm = {
	name: 'price_book_form',
	fields: [
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Includes',
			name: 'includes',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Duty', value: 'duty' },
				{ label: 'Vat', value: 'vat' },
				{ label: 'Vat and duty', value: 'vat_and_duty' },
				{ label: 'None', value: 'none' }
			]
		},
		{
			label: 'Status',
			name: 'status',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Draft', value: 'draft' },
				{ label: 'Published', value: 'published' },
				{ label: 'Archived', value: 'archived' }
			]
		}
	]
} as Schema;

export const PriceBookItemForm = {
	name: 'price_book_item_form',
	fields: [
		{
			label: 'Price book key',
			name: 'price_book_key',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Item number',
			name: 'item_number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Amount',
			name: 'amount',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Schedule',
			name: 'schedule',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Starts at',
					name: 'schedule.starts_at',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Ends at',
					name: 'schedule.ends_at',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		},
		{
			label: 'Item attributes: Map type not supported',
			name: 'item_attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const SubcatalogForm = {
	name: 'subcatalog_form',
	fields: [
		{
			label: 'Settings',
			name: 'settings',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Update policy',
					name: 'settings.update_policy',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Auto', value: 'auto' },
						{ label: 'Queue', value: 'queue' },
						{ label: 'Discard', value: 'discard' }
					]
				}
			]
		}
	]
} as Schema;

export const SubcatalogSettingsForm = {
	name: 'subcatalog_settings_form',
	fields: [
		{
			label: 'Update policy',
			name: 'update_policy',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Auto', value: 'auto' },
				{ label: 'Queue', value: 'queue' },
				{ label: 'Discard', value: 'discard' }
			]
		}
	]
} as Schema;

export const OrganizationCurrencySettingForm = {
	name: 'organization_currency_setting_form',
	fields: [
		{
			label: 'Base',
			name: 'base',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Target',
			name: 'target',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Margin',
			name: 'margin',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const HarmonizedLandedCostForm = {
	name: 'harmonized_landed_cost_form',
	fields: [
		{
			label: 'Address',
			name: 'address',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Text',
					name: 'address.text',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Streets',
					name: 'address.streets',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'Street number',
					name: 'address.street_number',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'City',
					name: 'address.city',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Province',
					name: 'address.province',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Postal',
					name: 'address.postal',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Country',
					name: 'address.country',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Latitude',
					name: 'address.latitude',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Longitude',
					name: 'address.longitude',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		},
		{
			label: 'Item numbers',
			name: 'item_numbers',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Source address',
			name: 'source_address',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Text',
					name: 'source_address.text',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Streets',
					name: 'source_address.streets',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'Street number',
					name: 'source_address.street_number',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'City',
					name: 'source_address.city',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Province',
					name: 'source_address.province',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Postal',
					name: 'source_address.postal',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Country',
					name: 'source_address.country',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Latitude',
					name: 'source_address.latitude',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Longitude',
					name: 'source_address.longitude',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		},
		{
			label: 'Order number',
			name: 'order_number',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Line items',
			name: 'line_items',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Number',
					name: 'number',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Quantity',
					name: 'quantity',
					dataType: DataTypes.INTEGER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Price',
					name: 'price',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Amount',
							name: 'price.amount',
							dataType: DataTypes.FLOAT,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Currency',
							name: 'price.currency',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Attributes: Map type not supported',
					name: 'attributes',
					component: ComponentTypes.PLAIN_TEXT
				},
				{
					label: 'Center',
					name: 'center',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Discount',
					name: 'discount',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Amount',
							name: 'discount.amount',
							dataType: DataTypes.FLOAT,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Currency',
							name: 'discount.currency',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				}
			]
		},
		{
			label: 'Tax registration id',
			name: 'tax_registration_id',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Billing address',
			name: 'billing_address',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Name',
					name: 'billing_address.name',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'First',
							name: 'billing_address.name.first',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Last',
							name: 'billing_address.name.last',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Streets',
					name: 'billing_address.streets',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'City',
					name: 'billing_address.city',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Province',
					name: 'billing_address.province',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Postal',
					name: 'billing_address.postal',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Country',
					name: 'billing_address.country',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Company',
					name: 'billing_address.company',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		}
	]
} as Schema;

export const CaptureForm = {
	name: 'capture_form',
	fields: [
		{
			label: 'Authorization id',
			name: 'authorization_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Key',
			name: 'key',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Amount',
			name: 'amount',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		},
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const IdentifierForm = {
	name: 'identifier_form',
	fields: [
		{
			label: 'Primary',
			name: 'primary',
			dataType: DataTypes.BOOLEAN,
			component: ComponentTypes.SWITCH,
			type: 'boolean'
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const CardForm = {
	name: 'card_form',
	fields: [
		{
			label: 'Number',
			name: 'number',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Cipher',
			name: 'cipher',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Expiration month',
			name: 'expiration_month',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Expiration year',
			name: 'expiration_year',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Cvv',
			name: 'cvv',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Address',
			name: 'address',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Name',
					name: 'address.name',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'First',
							name: 'address.name.first',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Last',
							name: 'address.name.last',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Streets',
					name: 'address.streets',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'City',
					name: 'address.city',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Province',
					name: 'address.province',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Postal',
					name: 'address.postal',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Country',
					name: 'address.country',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Company',
					name: 'address.company',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		},
		{
			label: 'Ip',
			name: 'ip',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Challenge text',
			name: 'challenge_text',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Challenge cipher',
			name: 'challenge_cipher',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Token type',
			name: 'token_type',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Permanent', value: 'permanent' },
				{ label: 'One time', value: 'one_time' }
			]
		},
		{
			label: 'Requested currency',
			name: 'requested_currency',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Metadata',
			name: 'metadata',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Merchant of record',
					name: 'metadata.merchant_of_record',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Flow', value: 'flow' },
						{ label: 'Organization', value: 'organization' },
						{ label: 'Mixed', value: 'mixed' }
					]
				}
			]
		}
	]
} as Schema;

export const CardNonceForm = {
	name: 'card_nonce_form',
	fields: [
		{
			label: 'Token',
			name: 'token',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const CardPaymentSourceForm = {
	name: 'card_payment_source_form',
	fields: [
		{
			label: 'Customer number',
			name: 'customer_number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Card id',
			name: 'card_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const RefundForm = {
	name: 'refund_form',
	fields: [
		{
			label: 'Authorization id',
			name: 'authorization_id',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Capture id',
			name: 'capture_id',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Order number',
			name: 'order_number',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Key',
			name: 'key',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Amount',
			name: 'amount',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		},
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Rma key',
			name: 'rma_key',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const ReversalForm = {
	name: 'reversal_form',
	fields: [
		{
			label: 'Key',
			name: 'key',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Authorization id',
			name: 'authorization_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Amount',
			name: 'amount',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		},
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const ReversalPutForm = {
	name: 'reversal_put_form',
	fields: [
		{
			label: 'Authorization id',
			name: 'authorization_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Amount',
			name: 'amount',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		},
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const VirtualCardForm = {
	name: 'virtual_card_form',
	fields: [
		{
			label: 'Limit',
			name: 'limit',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Amount',
					name: 'limit.amount',
					dataType: DataTypes.FLOAT,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Currency',
					name: 'limit.currency',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const CenterForm = {
	name: 'center_form',
	fields: [
		{
			label: 'Address',
			name: 'address',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Contact',
					name: 'address.contact',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Name',
							name: 'address.contact.name',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'First',
									name: 'address.contact.name.first',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Last',
									name: 'address.contact.name.last',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						},
						{
							label: 'Company',
							name: 'address.contact.company',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Email',
							name: 'address.contact.email',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Phone',
							name: 'address.contact.phone',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Location',
					name: 'address.location',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Text',
							name: 'address.location.text',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Streets',
							name: 'address.location.streets',
							component: ComponentTypes.FIELD_ARRAY,
							fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
						},
						{
							label: 'Street number',
							name: 'address.location.street_number',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'City',
							name: 'address.location.city',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Province',
							name: 'address.location.province',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Postal',
							name: 'address.location.postal',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Country',
							name: 'address.location.country',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Latitude',
							name: 'address.location.latitude',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Longitude',
							name: 'address.location.longitude',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Center key',
					name: 'address.center_key',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Center reference',
					name: 'address.center_reference',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Organization id',
							name: 'address.center_reference.organization_id',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Center key',
							name: 'address.center_reference.center_key',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Service',
					name: 'address.service',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Id',
							name: 'address.service.id',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Carrier',
							name: 'address.service.carrier',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Id',
									name: 'address.service.carrier.id',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						},
						{
							label: 'Name',
							name: 'address.service.name',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Center code',
							name: 'address.service.center_code',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				}
			]
		},
		{
			label: 'Packaging',
			name: 'packaging',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Dimensions',
					name: 'dimensions',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Product',
							name: 'dimensions.product',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Depth',
									name: 'dimensions.product.depth',
									component: ComponentTypes.SUB_FORM,
									fields: [
										{
											label: 'Value',
											name: 'dimensions.product.depth.value',
											component: ComponentTypes.TEXT_FIELD,
											validate: [{ type: ValidatorTypes.REQUIRED }]
										},
										{
											label: 'Units',
											name: 'dimensions.product.depth.units',
											component: ComponentTypes.SELECT,
											options: [
												{ label: 'Millimeter', value: 'millimeter' },
												{ label: 'Centimeter', value: 'centimeter' },
												{ label: 'Inch', value: 'inch' },
												{ label: 'Foot', value: 'foot' },
												{ label: 'Cubic inch', value: 'cubic_inch' },
												{ label: 'Cubic meter', value: 'cubic_meter' },
												{ label: 'Gram', value: 'gram' },
												{ label: 'Kilogram', value: 'kilogram' },
												{ label: 'Meter', value: 'meter' },
												{ label: 'Ounce', value: 'ounce' },
												{ label: 'Pound', value: 'pound' }
											]
										}
									]
								},
								{
									label: 'Diameter',
									name: 'dimensions.product.diameter',
									component: ComponentTypes.SUB_FORM,
									fields: [
										{
											label: 'Value',
											name: 'dimensions.product.diameter.value',
											component: ComponentTypes.TEXT_FIELD,
											validate: [{ type: ValidatorTypes.REQUIRED }]
										},
										{
											label: 'Units',
											name: 'dimensions.product.diameter.units',
											component: ComponentTypes.SELECT,
											options: [
												{ label: 'Millimeter', value: 'millimeter' },
												{ label: 'Centimeter', value: 'centimeter' },
												{ label: 'Inch', value: 'inch' },
												{ label: 'Foot', value: 'foot' },
												{ label: 'Cubic inch', value: 'cubic_inch' },
												{ label: 'Cubic meter', value: 'cubic_meter' },
												{ label: 'Gram', value: 'gram' },
												{ label: 'Kilogram', value: 'kilogram' },
												{ label: 'Meter', value: 'meter' },
												{ label: 'Ounce', value: 'ounce' },
												{ label: 'Pound', value: 'pound' }
											]
										}
									]
								},
								{
									label: 'Length',
									name: 'dimensions.product.length',
									component: ComponentTypes.SUB_FORM,
									fields: [
										{
											label: 'Value',
											name: 'dimensions.product.length.value',
											component: ComponentTypes.TEXT_FIELD,
											validate: [{ type: ValidatorTypes.REQUIRED }]
										},
										{
											label: 'Units',
											name: 'dimensions.product.length.units',
											component: ComponentTypes.SELECT,
											options: [
												{ label: 'Millimeter', value: 'millimeter' },
												{ label: 'Centimeter', value: 'centimeter' },
												{ label: 'Inch', value: 'inch' },
												{ label: 'Foot', value: 'foot' },
												{ label: 'Cubic inch', value: 'cubic_inch' },
												{ label: 'Cubic meter', value: 'cubic_meter' },
												{ label: 'Gram', value: 'gram' },
												{ label: 'Kilogram', value: 'kilogram' },
												{ label: 'Meter', value: 'meter' },
												{ label: 'Ounce', value: 'ounce' },
												{ label: 'Pound', value: 'pound' }
											]
										}
									]
								},
								{
									label: 'Weight',
									name: 'dimensions.product.weight',
									component: ComponentTypes.SUB_FORM,
									fields: [
										{
											label: 'Value',
											name: 'dimensions.product.weight.value',
											component: ComponentTypes.TEXT_FIELD,
											validate: [{ type: ValidatorTypes.REQUIRED }]
										},
										{
											label: 'Units',
											name: 'dimensions.product.weight.units',
											component: ComponentTypes.SELECT,
											options: [
												{ label: 'Millimeter', value: 'millimeter' },
												{ label: 'Centimeter', value: 'centimeter' },
												{ label: 'Inch', value: 'inch' },
												{ label: 'Foot', value: 'foot' },
												{ label: 'Cubic inch', value: 'cubic_inch' },
												{ label: 'Cubic meter', value: 'cubic_meter' },
												{ label: 'Gram', value: 'gram' },
												{ label: 'Kilogram', value: 'kilogram' },
												{ label: 'Meter', value: 'meter' },
												{ label: 'Ounce', value: 'ounce' },
												{ label: 'Pound', value: 'pound' }
											]
										}
									]
								},
								{
									label: 'Width',
									name: 'dimensions.product.width',
									component: ComponentTypes.SUB_FORM,
									fields: [
										{
											label: 'Value',
											name: 'dimensions.product.width.value',
											component: ComponentTypes.TEXT_FIELD,
											validate: [{ type: ValidatorTypes.REQUIRED }]
										},
										{
											label: 'Units',
											name: 'dimensions.product.width.units',
											component: ComponentTypes.SELECT,
											options: [
												{ label: 'Millimeter', value: 'millimeter' },
												{ label: 'Centimeter', value: 'centimeter' },
												{ label: 'Inch', value: 'inch' },
												{ label: 'Foot', value: 'foot' },
												{ label: 'Cubic inch', value: 'cubic_inch' },
												{ label: 'Cubic meter', value: 'cubic_meter' },
												{ label: 'Gram', value: 'gram' },
												{ label: 'Kilogram', value: 'kilogram' },
												{ label: 'Meter', value: 'meter' },
												{ label: 'Ounce', value: 'ounce' },
												{ label: 'Pound', value: 'pound' }
											]
										}
									]
								}
							]
						},
						{
							label: 'Packaging',
							name: 'dimensions.packaging',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Depth',
									name: 'dimensions.packaging.depth',
									component: ComponentTypes.SUB_FORM,
									fields: [
										{
											label: 'Value',
											name: 'dimensions.packaging.depth.value',
											component: ComponentTypes.TEXT_FIELD,
											validate: [{ type: ValidatorTypes.REQUIRED }]
										},
										{
											label: 'Units',
											name: 'dimensions.packaging.depth.units',
											component: ComponentTypes.SELECT,
											options: [
												{ label: 'Millimeter', value: 'millimeter' },
												{ label: 'Centimeter', value: 'centimeter' },
												{ label: 'Inch', value: 'inch' },
												{ label: 'Foot', value: 'foot' },
												{ label: 'Cubic inch', value: 'cubic_inch' },
												{ label: 'Cubic meter', value: 'cubic_meter' },
												{ label: 'Gram', value: 'gram' },
												{ label: 'Kilogram', value: 'kilogram' },
												{ label: 'Meter', value: 'meter' },
												{ label: 'Ounce', value: 'ounce' },
												{ label: 'Pound', value: 'pound' }
											]
										}
									]
								},
								{
									label: 'Diameter',
									name: 'dimensions.packaging.diameter',
									component: ComponentTypes.SUB_FORM,
									fields: [
										{
											label: 'Value',
											name: 'dimensions.packaging.diameter.value',
											component: ComponentTypes.TEXT_FIELD,
											validate: [{ type: ValidatorTypes.REQUIRED }]
										},
										{
											label: 'Units',
											name: 'dimensions.packaging.diameter.units',
											component: ComponentTypes.SELECT,
											options: [
												{ label: 'Millimeter', value: 'millimeter' },
												{ label: 'Centimeter', value: 'centimeter' },
												{ label: 'Inch', value: 'inch' },
												{ label: 'Foot', value: 'foot' },
												{ label: 'Cubic inch', value: 'cubic_inch' },
												{ label: 'Cubic meter', value: 'cubic_meter' },
												{ label: 'Gram', value: 'gram' },
												{ label: 'Kilogram', value: 'kilogram' },
												{ label: 'Meter', value: 'meter' },
												{ label: 'Ounce', value: 'ounce' },
												{ label: 'Pound', value: 'pound' }
											]
										}
									]
								},
								{
									label: 'Length',
									name: 'dimensions.packaging.length',
									component: ComponentTypes.SUB_FORM,
									fields: [
										{
											label: 'Value',
											name: 'dimensions.packaging.length.value',
											component: ComponentTypes.TEXT_FIELD,
											validate: [{ type: ValidatorTypes.REQUIRED }]
										},
										{
											label: 'Units',
											name: 'dimensions.packaging.length.units',
											component: ComponentTypes.SELECT,
											options: [
												{ label: 'Millimeter', value: 'millimeter' },
												{ label: 'Centimeter', value: 'centimeter' },
												{ label: 'Inch', value: 'inch' },
												{ label: 'Foot', value: 'foot' },
												{ label: 'Cubic inch', value: 'cubic_inch' },
												{ label: 'Cubic meter', value: 'cubic_meter' },
												{ label: 'Gram', value: 'gram' },
												{ label: 'Kilogram', value: 'kilogram' },
												{ label: 'Meter', value: 'meter' },
												{ label: 'Ounce', value: 'ounce' },
												{ label: 'Pound', value: 'pound' }
											]
										}
									]
								},
								{
									label: 'Weight',
									name: 'dimensions.packaging.weight',
									component: ComponentTypes.SUB_FORM,
									fields: [
										{
											label: 'Value',
											name: 'dimensions.packaging.weight.value',
											component: ComponentTypes.TEXT_FIELD,
											validate: [{ type: ValidatorTypes.REQUIRED }]
										},
										{
											label: 'Units',
											name: 'dimensions.packaging.weight.units',
											component: ComponentTypes.SELECT,
											options: [
												{ label: 'Millimeter', value: 'millimeter' },
												{ label: 'Centimeter', value: 'centimeter' },
												{ label: 'Inch', value: 'inch' },
												{ label: 'Foot', value: 'foot' },
												{ label: 'Cubic inch', value: 'cubic_inch' },
												{ label: 'Cubic meter', value: 'cubic_meter' },
												{ label: 'Gram', value: 'gram' },
												{ label: 'Kilogram', value: 'kilogram' },
												{ label: 'Meter', value: 'meter' },
												{ label: 'Ounce', value: 'ounce' },
												{ label: 'Pound', value: 'pound' }
											]
										}
									]
								},
								{
									label: 'Width',
									name: 'dimensions.packaging.width',
									component: ComponentTypes.SUB_FORM,
									fields: [
										{
											label: 'Value',
											name: 'dimensions.packaging.width.value',
											component: ComponentTypes.TEXT_FIELD,
											validate: [{ type: ValidatorTypes.REQUIRED }]
										},
										{
											label: 'Units',
											name: 'dimensions.packaging.width.units',
											component: ComponentTypes.SELECT,
											options: [
												{ label: 'Millimeter', value: 'millimeter' },
												{ label: 'Centimeter', value: 'centimeter' },
												{ label: 'Inch', value: 'inch' },
												{ label: 'Foot', value: 'foot' },
												{ label: 'Cubic inch', value: 'cubic_inch' },
												{ label: 'Cubic meter', value: 'cubic_meter' },
												{ label: 'Gram', value: 'gram' },
												{ label: 'Kilogram', value: 'kilogram' },
												{ label: 'Meter', value: 'meter' },
												{ label: 'Ounce', value: 'ounce' },
												{ label: 'Pound', value: 'pound' }
											]
										}
									]
								}
							]
						}
					]
				},
				{
					label: 'Name',
					name: 'name',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Number',
					name: 'number',
					component: ComponentTypes.TEXT_FIELD
				}
			],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Services',
			name: 'services',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Service',
					name: 'service',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Scheduled pickups',
					name: 'scheduled_pickups',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [
						{
							label: 'Day of week',
							name: 'day_of_week',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Sunday', value: 'sunday' },
								{ label: 'Monday', value: 'monday' },
								{ label: 'Tuesday', value: 'tuesday' },
								{ label: 'Wednesday', value: 'wednesday' },
								{ label: 'Thursday', value: 'thursday' },
								{ label: 'Friday', value: 'friday' },
								{ label: 'Saturday', value: 'saturday' }
							]
						},
						{
							label: 'Hour of day',
							name: 'hour_of_day',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Minute of hour',
							name: 'minute_of_hour',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Lead days',
					name: 'lead_days',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Min',
							name: 'lead_days.min',
							dataType: DataTypes.INTEGER,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Max',
							name: 'lead_days.max',
							dataType: DataTypes.INTEGER,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				}
			],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Schedule',
			name: 'schedule',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Calendar',
					name: 'schedule.calendar',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Weekdays', value: 'weekdays' },
						{ label: 'Everyday', value: 'everyday' }
					]
				},
				{
					label: 'Holiday',
					name: 'schedule.holiday',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Us bank holidays', value: 'us_bank_holidays' },
						{ label: 'Jewish holidays', value: 'jewish_holidays' }
					]
				},
				{
					label: 'Exception',
					name: 'schedule.exception',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [
						{
							label: 'Type',
							name: 'type',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Open', value: 'open' },
								{ label: 'Closed', value: 'closed' }
							]
						},
						{
							label: 'Datetime range',
							name: 'datetime_range',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'From',
									name: 'datetime_range.from',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'To',
									name: 'datetime_range.to',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						}
					],
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Cutoff',
					name: 'schedule.cutoff',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Min lead time',
					name: 'schedule.min_lead_time',
					dataType: DataTypes.INTEGER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number'
				},
				{
					label: 'Max lead time',
					name: 'schedule.max_lead_time',
					dataType: DataTypes.INTEGER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number'
				}
			]
		},
		{
			label: 'Timezone',
			name: 'timezone',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Key',
			name: 'key',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Capabilities: Array of enum type not supported',
			name: 'capabilities',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Partner center form',
			name: 'partner_center_form',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Partner id',
					name: 'partner_center_form.partner_id',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Number',
					name: 'partner_center_form.number',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Fees',
					name: 'partner_center_form.fees',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: '' }]
				}
			]
		}
	]
} as Schema;

export const CenterQuery = {
	name: 'center_query',
	fields: [
		{
			label: 'Q',
			name: 'q',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const DimensionEstimateForm = {
	name: 'dimension_estimate_form',
	fields: [
		{
			label: 'Q',
			name: 'q',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Dimensions',
			name: 'dimensions',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Depth',
					name: 'dimensions.depth',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Value',
							name: 'dimensions.depth.value',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Units',
							name: 'dimensions.depth.units',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Millimeter', value: 'millimeter' },
								{ label: 'Centimeter', value: 'centimeter' },
								{ label: 'Inch', value: 'inch' },
								{ label: 'Foot', value: 'foot' },
								{ label: 'Cubic inch', value: 'cubic_inch' },
								{ label: 'Cubic meter', value: 'cubic_meter' },
								{ label: 'Gram', value: 'gram' },
								{ label: 'Kilogram', value: 'kilogram' },
								{ label: 'Meter', value: 'meter' },
								{ label: 'Ounce', value: 'ounce' },
								{ label: 'Pound', value: 'pound' }
							]
						}
					]
				},
				{
					label: 'Length',
					name: 'dimensions.length',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Value',
							name: 'dimensions.length.value',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Units',
							name: 'dimensions.length.units',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Millimeter', value: 'millimeter' },
								{ label: 'Centimeter', value: 'centimeter' },
								{ label: 'Inch', value: 'inch' },
								{ label: 'Foot', value: 'foot' },
								{ label: 'Cubic inch', value: 'cubic_inch' },
								{ label: 'Cubic meter', value: 'cubic_meter' },
								{ label: 'Gram', value: 'gram' },
								{ label: 'Kilogram', value: 'kilogram' },
								{ label: 'Meter', value: 'meter' },
								{ label: 'Ounce', value: 'ounce' },
								{ label: 'Pound', value: 'pound' }
							]
						}
					]
				},
				{
					label: 'Weight',
					name: 'dimensions.weight',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Value',
							name: 'dimensions.weight.value',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Units',
							name: 'dimensions.weight.units',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Millimeter', value: 'millimeter' },
								{ label: 'Centimeter', value: 'centimeter' },
								{ label: 'Inch', value: 'inch' },
								{ label: 'Foot', value: 'foot' },
								{ label: 'Cubic inch', value: 'cubic_inch' },
								{ label: 'Cubic meter', value: 'cubic_meter' },
								{ label: 'Gram', value: 'gram' },
								{ label: 'Kilogram', value: 'kilogram' },
								{ label: 'Meter', value: 'meter' },
								{ label: 'Ounce', value: 'ounce' },
								{ label: 'Pound', value: 'pound' }
							]
						}
					]
				},
				{
					label: 'Width',
					name: 'dimensions.width',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Value',
							name: 'dimensions.width.value',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Units',
							name: 'dimensions.width.units',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Millimeter', value: 'millimeter' },
								{ label: 'Centimeter', value: 'centimeter' },
								{ label: 'Inch', value: 'inch' },
								{ label: 'Foot', value: 'foot' },
								{ label: 'Cubic inch', value: 'cubic_inch' },
								{ label: 'Cubic meter', value: 'cubic_meter' },
								{ label: 'Gram', value: 'gram' },
								{ label: 'Kilogram', value: 'kilogram' },
								{ label: 'Meter', value: 'meter' },
								{ label: 'Ounce', value: 'ounce' },
								{ label: 'Pound', value: 'pound' }
							]
						}
					]
				}
			]
		},
		{
			label: 'Position',
			name: 'position',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		}
	]
} as Schema;

export const InventoryRuleForm = {
	name: 'inventory_rule_form',
	fields: [
		{
			label: 'Position',
			name: 'position',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Query',
			name: 'query',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Strategy: Union type not supported',
			name: 'strategy',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const InventoryUpdateForm = {
	name: 'inventory_update_form',
	fields: [
		{
			label: 'Center',
			name: 'center',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Idempotency key',
			name: 'idempotency_key',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Item number',
			name: 'item_number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Quantity',
			name: 'quantity',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Type',
			name: 'type',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Change', value: 'change' },
				{ label: 'Set', value: 'set' }
			]
		},
		{
			label: 'Notes',
			name: 'notes',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const ManifestForm = {
	name: 'manifest_form',
	fields: [
		{
			label: 'Tracking numbers',
			name: 'tracking_numbers',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Service',
			name: 'service',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const QuoteForm = {
	name: 'quote_form',
	fields: [
		{
			label: 'Destination',
			name: 'destination',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Contact',
					name: 'destination.contact',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Name',
							name: 'destination.contact.name',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'First',
									name: 'destination.contact.name.first',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Last',
									name: 'destination.contact.name.last',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						},
						{
							label: 'Company',
							name: 'destination.contact.company',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Email',
							name: 'destination.contact.email',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Phone',
							name: 'destination.contact.phone',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Location',
					name: 'destination.location',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Text',
							name: 'destination.location.text',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Streets',
							name: 'destination.location.streets',
							component: ComponentTypes.FIELD_ARRAY,
							fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
						},
						{
							label: 'Street number',
							name: 'destination.location.street_number',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'City',
							name: 'destination.location.city',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Province',
							name: 'destination.location.province',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Postal',
							name: 'destination.location.postal',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Country',
							name: 'destination.location.country',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Latitude',
							name: 'destination.location.latitude',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Longitude',
							name: 'destination.location.longitude',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Center key',
					name: 'destination.center_key',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Center reference',
					name: 'destination.center_reference',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Organization id',
							name: 'destination.center_reference.organization_id',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Center key',
							name: 'destination.center_reference.center_key',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Service',
					name: 'destination.service',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Id',
							name: 'destination.service.id',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Carrier',
							name: 'destination.service.carrier',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Id',
									name: 'destination.service.carrier.id',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						},
						{
							label: 'Name',
							name: 'destination.service.name',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Center code',
							name: 'destination.service.center_code',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				}
			]
		},
		{
			label: 'Experience',
			name: 'experience',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Items',
			name: 'items',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Number',
					name: 'number',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Quantity',
					name: 'quantity',
					dataType: DataTypes.INTEGER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Shipment estimate',
					name: 'shipment_estimate',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'From',
							name: 'shipment_estimate.from',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'To',
							name: 'shipment_estimate.to',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Price',
					name: 'price',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Currency',
							name: 'price.currency',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Amount',
							name: 'price.amount',
							dataType: DataTypes.FLOAT,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Base',
							name: 'price.base',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Amount',
									name: 'price.base.amount',
									dataType: DataTypes.FLOAT,
									component: ComponentTypes.TEXT_FIELD,
									type: 'number',
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Currency',
									name: 'price.base.currency',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						}
					]
				},
				{
					label: 'Attributes: Map type not supported',
					name: 'attributes',
					component: ComponentTypes.PLAIN_TEXT
				},
				{
					label: 'Center',
					name: 'center',
					component: ComponentTypes.TEXT_FIELD
				}
			],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Delivered duty',
			name: 'delivered_duty',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Paid', value: 'paid' },
				{ label: 'Unpaid', value: 'unpaid' }
			]
		},
		{
			label: 'Delivered duties: Array of enum type not supported',
			name: 'delivered_duties',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Direction',
			name: 'direction',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Outbound', value: 'outbound' },
				{ label: 'Return', value: 'return' }
			]
		}
	]
} as Schema;

export const RatecardForm = {
	name: 'ratecard_form',
	fields: [
		{
			label: 'Direction',
			name: 'direction',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Outbound', value: 'outbound' },
				{ label: 'Return', value: 'return' }
			]
		},
		{
			label: 'Effective at',
			name: 'effective_at',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Origination zones',
			name: 'origination_zones',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Postals',
					name: 'postals',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'Provinces',
					name: 'provinces',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'Country',
					name: 'country',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Service',
			name: 'service',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Number',
			name: 'number',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Ratecard owner',
			name: 'ratecard_owner',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Flow', value: 'flow' },
				{ label: 'Organization', value: 'organization' }
			]
		}
	]
} as Schema;

export const RatecardEstimateSummaryForm = {
	name: 'ratecard_estimate_summary_form',
	fields: [
		{
			label: 'Origin',
			name: 'origin',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Destination',
			name: 'destination',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Service',
			name: 'service',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Center key',
			name: 'center_key',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const RatecardLaneForm = {
	name: 'ratecard_lane_form',
	fields: [
		{
			label: 'Ratecard id',
			name: 'ratecard_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Destination',
			name: 'destination',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Postals',
					name: 'destination.postals',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'Provinces',
					name: 'destination.provinces',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'Country',
					name: 'destination.country',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Shipment window',
			name: 'shipment_window',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'From',
					name: 'shipment_window.from',
					dataType: DataTypes.INTEGER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'To',
					name: 'shipment_window.to',
					dataType: DataTypes.INTEGER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Delivered duty',
			name: 'delivered_duty',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Paid', value: 'paid' },
				{ label: 'Unpaid', value: 'unpaid' }
			]
		},
		{
			label: 'Dim factor',
			name: 'dim_factor',
			dataType: DataTypes.FLOAT,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Fees',
			name: 'fees',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: '' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Origin',
			name: 'origin',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Postals',
					name: 'origin.postals',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'Provinces',
					name: 'origin.provinces',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'Country',
					name: 'origin.country',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Rounding',
			name: 'rounding',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Type',
					name: 'rounding.type',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Pattern', value: 'pattern' },
						{ label: 'Multiple', value: 'multiple' }
					]
				},
				{
					label: 'Method',
					name: 'rounding.method',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Up', value: 'up' },
						{ label: 'Down', value: 'down' },
						{ label: 'Nearest', value: 'nearest' }
					]
				},
				{
					label: 'Value',
					name: 'rounding.value',
					dataType: DataTypes.NUMBER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Rates',
			name: 'rates',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Amount',
					name: 'amount',
					dataType: DataTypes.FLOAT,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Weight',
					name: 'weight',
					dataType: DataTypes.FLOAT,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Weight unit',
			name: 'weight_unit',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Millimeter', value: 'millimeter' },
				{ label: 'Centimeter', value: 'centimeter' },
				{ label: 'Inch', value: 'inch' },
				{ label: 'Foot', value: 'foot' },
				{ label: 'Cubic inch', value: 'cubic_inch' },
				{ label: 'Cubic meter', value: 'cubic_meter' },
				{ label: 'Gram', value: 'gram' },
				{ label: 'Kilogram', value: 'kilogram' },
				{ label: 'Meter', value: 'meter' },
				{ label: 'Ounce', value: 'ounce' },
				{ label: 'Pound', value: 'pound' }
			]
		},
		{
			label: 'Distance unit',
			name: 'distance_unit',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Millimeter', value: 'millimeter' },
				{ label: 'Centimeter', value: 'centimeter' },
				{ label: 'Inch', value: 'inch' },
				{ label: 'Foot', value: 'foot' },
				{ label: 'Cubic inch', value: 'cubic_inch' },
				{ label: 'Cubic meter', value: 'cubic_meter' },
				{ label: 'Gram', value: 'gram' },
				{ label: 'Kilogram', value: 'kilogram' },
				{ label: 'Meter', value: 'meter' },
				{ label: 'Ounce', value: 'ounce' },
				{ label: 'Pound', value: 'pound' }
			]
		}
	]
} as Schema;

export const RatecardRateForm = {
	name: 'ratecard_rate_form',
	fields: [
		{
			label: 'Amount',
			name: 'amount',
			dataType: DataTypes.FLOAT,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Weight',
			name: 'weight',
			dataType: DataTypes.FLOAT,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ReturnForm = {
	name: 'return_form',
	fields: [
		{
			label: 'Items',
			name: 'items',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Item number',
					name: 'item_number',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Order number',
					name: 'order_number',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Quantity',
					name: 'quantity',
					dataType: DataTypes.INTEGER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Reason',
					name: 'reason',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Key',
							name: 'reason.key',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Name',
							name: 'reason.name',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Notes',
					name: 'notes',
					component: ComponentTypes.TEXT_FIELD
				}
			],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Tier id',
			name: 'tier_id',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Order number',
			name: 'order_number',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Service',
			name: 'service',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Destination',
			name: 'destination',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Contact',
					name: 'destination.contact',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Name',
							name: 'destination.contact.name',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'First',
									name: 'destination.contact.name.first',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Last',
									name: 'destination.contact.name.last',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						},
						{
							label: 'Company',
							name: 'destination.contact.company',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Email',
							name: 'destination.contact.email',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Phone',
							name: 'destination.contact.phone',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Location',
					name: 'destination.location',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Text',
							name: 'destination.location.text',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Streets',
							name: 'destination.location.streets',
							component: ComponentTypes.FIELD_ARRAY,
							fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
						},
						{
							label: 'Street number',
							name: 'destination.location.street_number',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'City',
							name: 'destination.location.city',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Province',
							name: 'destination.location.province',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Postal',
							name: 'destination.location.postal',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Country',
							name: 'destination.location.country',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Latitude',
							name: 'destination.location.latitude',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Longitude',
							name: 'destination.location.longitude',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Center key',
					name: 'destination.center_key',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Center reference',
					name: 'destination.center_reference',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Organization id',
							name: 'destination.center_reference.organization_id',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Center key',
							name: 'destination.center_reference.center_key',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Service',
					name: 'destination.service',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Id',
							name: 'destination.service.id',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Carrier',
							name: 'destination.service.carrier',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Id',
									name: 'destination.service.carrier.id',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						},
						{
							label: 'Name',
							name: 'destination.service.name',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Center code',
							name: 'destination.service.center_code',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				}
			]
		},
		{
			label: 'Key',
			name: 'key',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Origin',
			name: 'origin',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Contact',
					name: 'origin.contact',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Name',
							name: 'origin.contact.name',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'First',
									name: 'origin.contact.name.first',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Last',
									name: 'origin.contact.name.last',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						},
						{
							label: 'Company',
							name: 'origin.contact.company',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Email',
							name: 'origin.contact.email',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Phone',
							name: 'origin.contact.phone',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Location',
					name: 'origin.location',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Text',
							name: 'origin.location.text',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Streets',
							name: 'origin.location.streets',
							component: ComponentTypes.FIELD_ARRAY,
							fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
						},
						{
							label: 'Street number',
							name: 'origin.location.street_number',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'City',
							name: 'origin.location.city',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Province',
							name: 'origin.location.province',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Postal',
							name: 'origin.location.postal',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Country',
							name: 'origin.location.country',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Latitude',
							name: 'origin.location.latitude',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Longitude',
							name: 'origin.location.longitude',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Center key',
					name: 'origin.center_key',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Center reference',
					name: 'origin.center_reference',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Organization id',
							name: 'origin.center_reference.organization_id',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Center key',
							name: 'origin.center_reference.center_key',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Service',
					name: 'origin.service',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Id',
							name: 'origin.service.id',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Carrier',
							name: 'origin.service.carrier',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Id',
									name: 'origin.service.carrier.id',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						},
						{
							label: 'Name',
							name: 'origin.service.name',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Center code',
							name: 'origin.service.center_code',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				}
			]
		},
		{
			label: 'Center key',
			name: 'center_key',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const ShippingConfigurationForm = {
	name: 'shipping_configuration_form',
	fields: [
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ShippingLaneForm = {
	name: 'shipping_lane_form',
	fields: [
		{
			label: 'From',
			name: 'from',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'To',
			name: 'to',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Strategy',
			name: 'strategy',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Oldest', value: 'oldest' },
				{ label: 'Fastest', value: 'fastest' },
				{ label: 'Lowest cost', value: 'lowest_cost' },
				{ label: 'Highest priority', value: 'highest_priority' }
			]
		},
		{
			label: 'Direction',
			name: 'direction',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Outbound', value: 'outbound' },
				{ label: 'Return', value: 'return' }
			]
		},
		{
			label: 'Preference',
			name: 'preference',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Lowest cost', value: 'lowest_cost' },
				{ label: 'Default tier', value: 'default_tier' }
			]
		}
	]
} as Schema;

export const ShippingLaneDefaultTierForm = {
	name: 'shipping_lane_default_tier_form',
	fields: [
		{
			label: 'Tier id',
			name: 'tier_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ShippingConfigurationCopyForm = {
	name: 'shipping_configuration_copy_form',
	fields: [
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const DetailedShippingNotificationForm = {
	name: 'detailed_shipping_notification_form',
	fields: [
		{
			label: 'Key',
			name: 'key',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Carrier tracking number',
			name: 'carrier_tracking_number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Destination',
			name: 'destination',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Contact',
					name: 'destination.contact',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Name',
							name: 'destination.contact.name',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'First',
									name: 'destination.contact.name.first',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Last',
									name: 'destination.contact.name.last',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						},
						{
							label: 'Company',
							name: 'destination.contact.company',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Email',
							name: 'destination.contact.email',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Phone',
							name: 'destination.contact.phone',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Location',
					name: 'destination.location',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Text',
							name: 'destination.location.text',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Streets',
							name: 'destination.location.streets',
							component: ComponentTypes.FIELD_ARRAY,
							fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
						},
						{
							label: 'Street number',
							name: 'destination.location.street_number',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'City',
							name: 'destination.location.city',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Province',
							name: 'destination.location.province',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Postal',
							name: 'destination.location.postal',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Country',
							name: 'destination.location.country',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Latitude',
							name: 'destination.location.latitude',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Longitude',
							name: 'destination.location.longitude',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Center key',
					name: 'destination.center_key',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Center reference',
					name: 'destination.center_reference',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Organization id',
							name: 'destination.center_reference.organization_id',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Center key',
							name: 'destination.center_reference.center_key',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Service',
					name: 'destination.service',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Id',
							name: 'destination.service.id',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Carrier',
							name: 'destination.service.carrier',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Id',
									name: 'destination.service.carrier.id',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						},
						{
							label: 'Name',
							name: 'destination.service.name',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Center code',
							name: 'destination.service.center_code',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				}
			]
		},
		{
			label: 'Order number',
			name: 'order_number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Package',
			name: 'package',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Dimensions',
					name: 'package.dimensions',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Depth',
							name: 'package.dimensions.depth',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'package.dimensions.depth.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'package.dimensions.depth.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Diameter',
							name: 'package.dimensions.diameter',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'package.dimensions.diameter.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'package.dimensions.diameter.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Length',
							name: 'package.dimensions.length',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'package.dimensions.length.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'package.dimensions.length.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Weight',
							name: 'package.dimensions.weight',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'package.dimensions.weight.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'package.dimensions.weight.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						},
						{
							label: 'Width',
							name: 'package.dimensions.width',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Value',
									name: 'package.dimensions.width.value',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Units',
									name: 'package.dimensions.width.units',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Millimeter', value: 'millimeter' },
										{ label: 'Centimeter', value: 'centimeter' },
										{ label: 'Inch', value: 'inch' },
										{ label: 'Foot', value: 'foot' },
										{ label: 'Cubic inch', value: 'cubic_inch' },
										{ label: 'Cubic meter', value: 'cubic_meter' },
										{ label: 'Gram', value: 'gram' },
										{ label: 'Kilogram', value: 'kilogram' },
										{ label: 'Meter', value: 'meter' },
										{ label: 'Ounce', value: 'ounce' },
										{ label: 'Pound', value: 'pound' }
									]
								}
							]
						}
					]
				},
				{
					label: 'Items',
					name: 'package.items',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [
						{
							label: 'Number',
							name: 'number',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Quantity',
							name: 'quantity',
							dataType: DataTypes.INTEGER,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Shipment estimate',
							name: 'shipment_estimate',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'From',
									name: 'shipment_estimate.from',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'To',
									name: 'shipment_estimate.to',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						},
						{
							label: 'Price',
							name: 'price',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Amount',
									name: 'price.amount',
									dataType: DataTypes.FLOAT,
									component: ComponentTypes.TEXT_FIELD,
									type: 'number',
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Currency',
									name: 'price.currency',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						},
						{
							label: 'Attributes: Map type not supported',
							name: 'attributes',
							component: ComponentTypes.PLAIN_TEXT
						},
						{
							label: 'Center',
							name: 'center',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Discount',
							name: 'discount',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Amount',
									name: 'discount.amount',
									dataType: DataTypes.FLOAT,
									component: ComponentTypes.TEXT_FIELD,
									type: 'number',
									validate: [{ type: ValidatorTypes.REQUIRED }]
								},
								{
									label: 'Currency',
									name: 'discount.currency',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						},
						{
							label: 'Discounts',
							name: 'discounts',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Discounts',
									name: 'discounts.discounts',
									component: ComponentTypes.FIELD_ARRAY,
									fields: [
										{
											label: 'Offer: Union type not supported',
											name: 'offer',
											component: ComponentTypes.PLAIN_TEXT
										},
										{
											label: 'Target',
											name: 'target',
											component: ComponentTypes.SELECT,
											options: [
												{ label: 'Item', value: 'item' },
												{ label: 'Shipping', value: 'shipping' }
											]
										},
										{
											label: 'Label',
											name: 'label',
											component: ComponentTypes.TEXT_FIELD
										}
									],
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						}
					],
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Reference number',
					name: 'package.reference_number',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		},
		{
			label: 'Service',
			name: 'service',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Origin',
			name: 'origin',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Contact',
					name: 'origin.contact',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Name',
							name: 'origin.contact.name',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'First',
									name: 'origin.contact.name.first',
									component: ComponentTypes.TEXT_FIELD
								},
								{
									label: 'Last',
									name: 'origin.contact.name.last',
									component: ComponentTypes.TEXT_FIELD
								}
							]
						},
						{
							label: 'Company',
							name: 'origin.contact.company',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Email',
							name: 'origin.contact.email',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Phone',
							name: 'origin.contact.phone',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Location',
					name: 'origin.location',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Text',
							name: 'origin.location.text',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Streets',
							name: 'origin.location.streets',
							component: ComponentTypes.FIELD_ARRAY,
							fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
						},
						{
							label: 'Street number',
							name: 'origin.location.street_number',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'City',
							name: 'origin.location.city',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Province',
							name: 'origin.location.province',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Postal',
							name: 'origin.location.postal',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Country',
							name: 'origin.location.country',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Latitude',
							name: 'origin.location.latitude',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Longitude',
							name: 'origin.location.longitude',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Center key',
					name: 'origin.center_key',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Center reference',
					name: 'origin.center_reference',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Organization id',
							name: 'origin.center_reference.organization_id',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Center key',
							name: 'origin.center_reference.center_key',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Service',
					name: 'origin.service',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Id',
							name: 'origin.service.id',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Carrier',
							name: 'origin.service.carrier',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Id',
									name: 'origin.service.carrier.id',
									component: ComponentTypes.TEXT_FIELD,
									validate: [{ type: ValidatorTypes.REQUIRED }]
								}
							]
						},
						{
							label: 'Name',
							name: 'origin.service.name',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Center code',
							name: 'origin.service.center_code',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				}
			]
		},
		{
			label: 'Shipment recipient',
			name: 'shipment_recipient',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Customer', value: 'customer' },
				{ label: 'Return', value: 'return' },
				{ label: 'Crossdock', value: 'crossdock' }
			]
		}
	]
} as Schema;

export const TierForm = {
	name: 'tier_form',
	fields: [
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Integration',
			name: 'integration',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Direct', value: 'direct' },
				{ label: 'Information', value: 'information' },
				{ label: 'Preadvice', value: 'preadvice' }
			]
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Message',
			name: 'message',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Rules',
			name: 'rules',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Position',
					name: 'position',
					dataType: DataTypes.INTEGER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number'
				},
				{
					label: 'Query',
					name: 'query',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Outcome: Union type not supported',
					name: 'outcome',
					component: ComponentTypes.PLAIN_TEXT
				}
			],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Services',
			name: 'services',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Strategy',
			name: 'strategy',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Fastest', value: 'fastest' },
				{ label: 'Lowest cost', value: 'lowest_cost' }
			]
		},
		{
			label: 'Visibility',
			name: 'visibility',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Public', value: 'public' },
				{ label: 'Private', value: 'private' }
			]
		},
		{
			label: 'Description',
			name: 'description',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Direction',
			name: 'direction',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Outbound', value: 'outbound' },
				{ label: 'Return', value: 'return' }
			]
		},
		{
			label: 'Display',
			name: 'display',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Estimate',
					name: 'display.estimate',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Type',
							name: 'display.estimate.type',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Calculated', value: 'calculated' },
								{ label: 'Custom', value: 'custom' }
							]
						},
						{
							label: 'Label',
							name: 'display.estimate.label',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				}
			]
		},
		{
			label: 'Shipping lane',
			name: 'shipping_lane',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Surcharge settings',
			name: 'surcharge_settings',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Key',
					name: 'key',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Ratecard base cost', value: 'ratecard_base_cost' },
						{ label: 'Ratecard ddp fee', value: 'ratecard_ddp_fee' },
						{ label: 'Ratecard fuel surcharge', value: 'ratecard_fuel_surcharge' },
						{ label: 'Ratecard oversized shipment fee', value: 'ratecard_oversized_shipment_fee' },
						{ label: 'Ratecard rural shipment fee', value: 'ratecard_rural_shipment_fee' },
						{
							label: 'Ratecard emergency situation surcharge fee',
							value: 'ratecard_emergency_situation_surcharge_fee'
						},
						{ label: 'Center commercial invoice fee', value: 'center_commercial_invoice_fee' },
						{ label: 'Center inbound carton fee', value: 'center_inbound_carton_fee' },
						{ label: 'Center outbound carton fee', value: 'center_outbound_carton_fee' }
					]
				},
				{
					label: 'Responsible party',
					name: 'responsible_party',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Organization', value: 'organization' },
						{ label: 'Customer', value: 'customer' }
					]
				}
			]
		},
		{
			label: 'Settings',
			name: 'settings',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Availability',
					name: 'settings.availability',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Always', value: 'always' },
						{ label: 'Backup', value: 'backup' }
					]
				}
			]
		}
	]
} as Schema;

export const TrackingForm = {
	name: 'tracking_form',
	fields: [
		{
			label: 'Status',
			name: 'status',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Label created', value: 'label_created' },
				{ label: 'Pending', value: 'pending' },
				{ label: 'Info received', value: 'info_received' },
				{ label: 'Picked up', value: 'picked_up' },
				{ label: 'In transit', value: 'in_transit' },
				{ label: 'Out for delivery', value: 'out_for_delivery' },
				{ label: 'Attempt fail', value: 'attempt_fail' },
				{ label: 'Delivered', value: 'delivered' },
				{ label: 'Exception', value: 'exception' },
				{ label: 'Returned', value: 'returned' },
				{ label: 'Expired', value: 'expired' }
			]
		},
		{
			label: 'Order number',
			name: 'order_number',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Window',
			name: 'window',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'From',
					name: 'window.from',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'To',
					name: 'window.to',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		}
	]
} as Schema;

export const TrackingLabelForm = {
	name: 'tracking_label_form',
	fields: [
		{
			label: 'Tracking id',
			name: 'tracking_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Status',
			name: 'status',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Label created', value: 'label_created' },
				{ label: 'Pending', value: 'pending' },
				{ label: 'Info received', value: 'info_received' },
				{ label: 'Picked up', value: 'picked_up' },
				{ label: 'In transit', value: 'in_transit' },
				{ label: 'Out for delivery', value: 'out_for_delivery' },
				{ label: 'Attempt fail', value: 'attempt_fail' },
				{ label: 'Delivered', value: 'delivered' },
				{ label: 'Exception', value: 'exception' },
				{ label: 'Returned', value: 'returned' },
				{ label: 'Expired', value: 'expired' }
			]
		},
		{
			label: 'Carrier',
			name: 'carrier',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Carrier tracking number',
			name: 'carrier_tracking_number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Delivery estimate',
			name: 'delivery_estimate',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Description',
			name: 'description',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Timestamp',
			name: 'timestamp',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Parent id',
			name: 'parent_id',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const WebhookForm = {
	name: 'webhook_form',
	fields: [
		{
			label: 'Url',
			name: 'url',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Events',
			name: 'events',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const WebhookSettings = {
	name: 'webhook_settings',
	fields: [
		{
			label: 'Secret',
			name: 'secret',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Retry max attempts',
			name: 'retry_max_attempts',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Retry sleep ms',
			name: 'retry_sleep_ms',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Sleep ms',
			name: 'sleep_ms',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const Address = {
	name: 'address',
	fields: [
		{
			label: 'Text',
			name: 'text',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Streets',
			name: 'streets',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
		},
		{
			label: 'Street number',
			name: 'street_number',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'City',
			name: 'city',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Province',
			name: 'province',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Postal',
			name: 'postal',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Country',
			name: 'country',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Latitude',
			name: 'latitude',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Longitude',
			name: 'longitude',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const InvoiceExportForm = {
	name: 'invoice_export_form',
	fields: [
		{
			label: 'Date from',
			name: 'date_from',
			component: ComponentTypes.DATE_PICKER
		},
		{
			label: 'Date to',
			name: 'date_to',
			component: ComponentTypes.DATE_PICKER
		}
	]
} as Schema;

export const ConsumerInvoiceFormByOrder = {
	name: 'consumer_invoice_form_by_order',
	fields: [
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const CreditMemoForm = {
	name: 'credit_memo_form',
	fields: [
		{
			label: 'Refund id',
			name: 'refund_id',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Refund key',
			name: 'refund_key',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Refund identifier',
			name: 'refund_identifier',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Lines',
			name: 'lines',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: '' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const ConsumerInvoiceForm = {
	name: 'consumer_invoice_form',
	fields: [
		{
			label: 'Order number',
			name: 'order_number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const CountryPickerForm = {
	name: 'country_picker_form',
	fields: [
		{
			label: 'Source',
			name: 'source',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Experience', value: 'experience' },
				{ label: 'Destination', value: 'destination' }
			]
		}
	]
} as Schema;

export const CustomerForm = {
	name: 'customer_form',
	fields: [
		{
			label: 'Number',
			name: 'number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Email',
			name: 'email',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'First',
					name: 'name.first',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Last',
					name: 'name.last',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		},
		{
			label: 'Phone',
			name: 'phone',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const CustomerClientToken = {
	name: 'customer_client_token',
	fields: [
		{
			label: 'Token',
			name: 'token',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const CustomerPutForm = {
	name: 'customer_put_form',
	fields: [
		{
			label: 'Email',
			name: 'email',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'First',
					name: 'name.first',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Last',
					name: 'name.last',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		},
		{
			label: 'Phone',
			name: 'phone',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const CustomerAddressBookContactForm = {
	name: 'customer_address_book_contact_form',
	fields: [
		{
			label: 'Address',
			name: 'address',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Text',
					name: 'address.text',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Streets',
					name: 'address.streets',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'Street number',
					name: 'address.street_number',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'City',
					name: 'address.city',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Province',
					name: 'address.province',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Postal',
					name: 'address.postal',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Country',
					name: 'address.country',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Latitude',
					name: 'address.latitude',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Longitude',
					name: 'address.longitude',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		},
		{
			label: 'Contact',
			name: 'contact',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Name',
					name: 'contact.name',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'First',
							name: 'contact.name.first',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Last',
							name: 'contact.name.last',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				},
				{
					label: 'Company',
					name: 'contact.company',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Email',
					name: 'contact.email',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Phone',
					name: 'contact.phone',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		},
		{
			label: 'Address preferences',
			name: 'address_preferences',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Type',
					name: 'type',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Billing', value: 'billing' },
						{ label: 'Invoice', value: 'invoice' },
						{ label: 'Shipping', value: 'shipping' }
					]
				}
			]
		}
	]
} as Schema;

export const CustomerPurgeSettingsForm = {
	name: 'customer_purge_settings_form',
	fields: [
		{
			label: 'Days until purge unused',
			name: 'days_until_purge_unused',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Days until purge used',
			name: 'days_until_purge_used',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const EcommercePlatformForm = {
	name: 'ecommerce_platform_form',
	fields: [
		{
			label: 'Type',
			name: 'type',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Commercetools', value: 'commercetools' },
				{ label: 'Custom', value: 'custom' },
				{ label: 'Magento', value: 'magento' },
				{ label: 'Shopify', value: 'shopify' },
				{ label: 'Sfcc', value: 'sfcc' },
				{ label: 'Solidus', value: 'solidus' },
				{ label: 'Workarea', value: 'workarea' }
			]
		},
		{
			label: 'Version',
			name: 'version',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const ExclusionRuleForm = {
	name: 'exclusion_rule_form',
	fields: [
		{
			label: 'Q',
			name: 'q',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Regions',
			name: 'regions',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Description',
			name: 'description',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const ExportForm = {
	name: 'export_form',
	fields: [
		{
			label: 'Type: Union type not supported',
			name: 'type',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Emails',
			name: 'emails',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
		},
		{
			label: 'Organization q',
			name: 'organization_q',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const FraudEmailRuleForm = {
	name: 'fraud_email_rule_form',
	fields: [
		{
			label: 'Rule',
			name: 'rule',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Id',
					name: 'rule.id',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Email',
					name: 'rule.email',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Decision',
					name: 'rule.decision',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Approved', value: 'approved' },
						{ label: 'Declined', value: 'declined' }
					]
				}
			]
		}
	]
} as Schema;

export const FtpFileForm = {
	name: 'ftp_file_form',
	fields: [
		{
			label: 'Url',
			name: 'url',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Directory',
			name: 'directory',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const FtpFolderForm = {
	name: 'ftp_folder_form',
	fields: [
		{
			label: 'Path',
			name: 'path',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Webhook',
			name: 'webhook',
			dataType: DataTypes.BOOLEAN,
			component: ComponentTypes.SWITCH,
			type: 'boolean',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Description',
			name: 'description',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const FtpOrganizationSettingsForm = {
	name: 'ftp_organization_settings_form',
	fields: [
		{
			label: 'Enabled',
			name: 'enabled',
			dataType: DataTypes.BOOLEAN,
			component: ComponentTypes.SWITCH,
			type: 'boolean',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Emails',
			name: 'emails',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const FulfillmentCancellationForm = {
	name: 'fulfillment_cancellation_form',
	fields: [
		{
			label: 'Change source',
			name: 'change_source',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Consumer', value: 'consumer' },
				{ label: 'Retailer', value: 'retailer' },
				{ label: 'Fulfillment', value: 'fulfillment' },
				{ label: 'Flow', value: 'flow' },
				{ label: 'Carrier', value: 'carrier' }
			]
		},
		{
			label: 'Reason',
			name: 'reason',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Out of stock', value: 'out_of_stock' },
				{ label: 'Consumer requested', value: 'consumer_requested' },
				{ label: 'Flow cancel', value: 'flow_cancel' }
			]
		},
		{
			label: 'Lines',
			name: 'lines',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Item number',
					name: 'item_number',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Line number',
					name: 'line_number',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Quantity',
					name: 'quantity',
					dataType: DataTypes.INTEGER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const FulfillmentCompleteCancellationForm = {
	name: 'fulfillment_complete_cancellation_form',
	fields: [
		{
			label: 'Change source',
			name: 'change_source',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Consumer', value: 'consumer' },
				{ label: 'Retailer', value: 'retailer' },
				{ label: 'Fulfillment', value: 'fulfillment' },
				{ label: 'Flow', value: 'flow' },
				{ label: 'Carrier', value: 'carrier' }
			]
		},
		{
			label: 'Reason',
			name: 'reason',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Out of stock', value: 'out_of_stock' },
				{ label: 'Consumer requested', value: 'consumer_requested' },
				{ label: 'Flow cancel', value: 'flow_cancel' }
			]
		}
	]
} as Schema;

export const ImportForm = {
	name: 'import_form',
	fields: [
		{
			label: 'Type',
			name: 'type',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Catalog items', value: 'catalog_items' },
				{ label: 'Customs descriptions', value: 'customs_descriptions' },
				{ label: 'Customs description tariffs', value: 'customs_description_tariffs' },
				{ label: 'Experiences with settings', value: 'experiences_with_settings' },
				{ label: 'Harmonization codes', value: 'harmonization_codes' },
				{ label: 'Item prices', value: 'item_prices' },
				{ label: 'Item form overlays', value: 'item_form_overlays' },
				{ label: 'Price book items', value: 'price_book_items' },
				{ label: 'Price book items query', value: 'price_book_items_query' },
				{ label: 'Ratecard lanes', value: 'ratecard_lanes' },
				{ label: 'Order service changes', value: 'order_service_changes' }
			]
		},
		{
			label: 'Source url',
			name: 'source_url',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Filename',
			name: 'filename',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Emails',
			name: 'emails',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
		}
	]
} as Schema;

export const ImportTemplateForm = {
	name: 'import_template_form',
	fields: [
		{
			label: 'Type',
			name: 'type',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Catalog items', value: 'catalog_items' },
				{ label: 'Customs descriptions', value: 'customs_descriptions' },
				{ label: 'Customs description tariffs', value: 'customs_description_tariffs' },
				{ label: 'Experiences with settings', value: 'experiences_with_settings' },
				{ label: 'Harmonization codes', value: 'harmonization_codes' },
				{ label: 'Item prices', value: 'item_prices' },
				{ label: 'Item form overlays', value: 'item_form_overlays' },
				{ label: 'Price book items', value: 'price_book_items' },
				{ label: 'Price book items query', value: 'price_book_items_query' },
				{ label: 'Ratecard lanes', value: 'ratecard_lanes' },
				{ label: 'Order service changes', value: 'order_service_changes' }
			]
		}
	]
} as Schema;

export const InvitationForm = {
	name: 'invitation_form',
	fields: [
		{
			label: 'Organization',
			name: 'organization',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Email',
			name: 'email',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'First',
					name: 'name.first',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Last',
					name: 'name.last',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		},
		{
			label: 'Role',
			name: 'role',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Admin', value: 'admin' },
				{ label: 'Member', value: 'member' }
			]
		},
		{
			label: 'Roles: Array of enum type not supported',
			name: 'roles',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const MembershipForm = {
	name: 'membership_form',
	fields: [
		{
			label: 'Organization',
			name: 'organization',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'User',
			name: 'user',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Role',
			name: 'role',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Admin', value: 'admin' },
				{ label: 'Member', value: 'member' }
			]
		},
		{
			label: 'Roles: Array of enum type not supported',
			name: 'roles',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const MembershipPutForm = {
	name: 'membership_put_form',
	fields: [
		{
			label: 'Role',
			name: 'role',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Admin', value: 'admin' },
				{ label: 'Member', value: 'member' }
			]
		},
		{
			label: 'Roles: Array of enum type not supported',
			name: 'roles',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const MerchantGiftCardBalanceForm = {
	name: 'merchant_gift_card_balance_form',
	fields: [
		{
			label: 'Number',
			name: 'number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const MerchantGiftCardRedemptionForm = {
	name: 'merchant_gift_card_redemption_form',
	fields: [
		{
			label: 'Number',
			name: 'number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Amount',
			name: 'amount',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const MerchantGiftCardReversalForm = {
	name: 'merchant_gift_card_reversal_form',
	fields: [
		{
			label: 'Number',
			name: 'number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Amount',
			name: 'amount',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const OrganizationAuthorizationForm = {
	name: 'organization_authorization_form',
	fields: [
		{
			label: 'Organization',
			name: 'organization',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Environment',
			name: 'environment',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Sandbox', value: 'sandbox' },
				{ label: 'Production', value: 'production' }
			]
		}
	]
} as Schema;

export const OrganizationDefaultConfigurationsForm = {
	name: 'organization_default_configurations_form',
	fields: [
		{
			label: 'Id',
			name: 'id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const OrganizationTokenForm = {
	name: 'organization_token_form',
	fields: [
		{
			label: 'Environment',
			name: 'environment',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Sandbox', value: 'sandbox' },
				{ label: 'Production', value: 'production' }
			]
		},
		{
			label: 'Description',
			name: 'description',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const PartnerTokenForm = {
	name: 'partner_token_form',
	fields: [
		{
			label: 'Environment',
			name: 'environment',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Sandbox', value: 'sandbox' },
				{ label: 'Production', value: 'production' }
			]
		},
		{
			label: 'Description',
			name: 'description',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const PasswordResetForm = {
	name: 'password_reset_form',
	fields: [
		{
			label: 'Token',
			name: 'token',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Password',
			name: 'password',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const PasswordResetRequestForm = {
	name: 'password_reset_request_form',
	fields: [
		{
			label: 'Email',
			name: 'email',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ScheduledExportForm = {
	name: 'scheduled_export_form',
	fields: [
		{
			label: 'User id',
			name: 'user_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Organization q',
			name: 'organization_q',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Hour',
			name: 'hour',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Minute',
			name: 'minute',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Timezone',
			name: 'timezone',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Types',
			name: 'types',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: '' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const SessionForm = {
	name: 'session_form',
	fields: [
		{
			label: 'Ip',
			name: 'ip',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Experience',
			name: 'experience',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Country',
			name: 'country',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Language',
			name: 'language',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Locale',
			name: 'locale',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const SessionPutForm = {
	name: 'session_put_form',
	fields: [
		{
			label: 'Ip',
			name: 'ip',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Experience',
			name: 'experience',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Country',
			name: 'country',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Language',
			name: 'language',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Locale',
			name: 'locale',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const SessionAuthorizationForm = {
	name: 'session_authorization_form',
	fields: [
		{
			label: 'Session',
			name: 'session',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ShopifyOrderAttributesForm = {
	name: 'shopify_order_attributes_form',
	fields: [
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const ShopifyCartChangeForm = {
	name: 'shopify_cart_change_form',
	fields: [
		{
			label: 'Quantity',
			name: 'quantity',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Line',
			name: 'line',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		},
		{
			label: 'Id',
			name: 'id',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		},
		{
			label: 'Properties: Map type not supported',
			name: 'properties',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const GeoForm = {
	name: 'geo_form',
	fields: [
		{
			label: 'Country',
			name: 'country',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Currency',
			name: 'currency',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Language',
			name: 'language',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Locale',
			name: 'locale',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Experience',
			name: 'experience',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ShopifyExternalCart = {
	name: 'shopify_external_cart',
	fields: []
} as Schema;

export const ShopifyLocalizationSettingForm = {
	name: 'shopify_localization_setting_form',
	fields: [
		{
			label: 'Method',
			name: 'method',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Api', value: 'api' },
				{ label: 'Ssr', value: 'ssr' }
			]
		},
		{
			label: 'Datetime range',
			name: 'datetime_range',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'From',
					name: 'datetime_range.from',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'To',
					name: 'datetime_range.to',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		}
	]
} as Schema;

export const ShopifyLocationFlowCenterMappingForm = {
	name: 'shopify_location_flow_center_mapping_form',
	fields: [
		{
			label: 'Shopify location id',
			name: 'shopify_location_id',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Flow center key',
			name: 'flow_center_key',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ShopifyPrivateAppForm = {
	name: 'shopify_private_app_form',
	fields: [
		{
			label: 'Api key',
			name: 'api_key',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Password',
			name: 'password',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const SyncRecordForm = {
	name: 'sync_record_form',
	fields: [
		{
			label: 'Stream key',
			name: 'stream_key',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'System',
			name: 'system',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Value',
			name: 'value',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const SyncRecordFailureForm = {
	name: 'sync_record_failure_form',
	fields: [
		{
			label: 'Stream key',
			name: 'stream_key',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Value',
			name: 'value',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'System',
			name: 'system',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Reason',
			name: 'reason',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Inventory', value: 'inventory' },
				{ label: 'Address', value: 'address' },
				{ label: 'Promotion', value: 'promotion' },
				{ label: 'Other', value: 'other' }
			]
		},
		{
			label: 'Attributes: Map type not supported',
			name: 'attributes',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const SyncStreamForm = {
	name: 'sync_stream_form',
	fields: [
		{
			label: 'Type',
			name: 'type',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Submitted order', value: 'submitted_order' },
				{ label: 'Placed order', value: 'placed_order' }
			]
		},
		{
			label: 'Systems',
			name: 'systems',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Settings',
			name: 'settings',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Pending record after',
					name: 'settings.pending_record_after',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Unit',
							name: 'settings.pending_record_after.unit',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Day', value: 'day' },
								{ label: 'Hour', value: 'hour' },
								{ label: 'Minute', value: 'minute' },
								{ label: 'Second', value: 'second' }
							]
						},
						{
							label: 'Value',
							name: 'settings.pending_record_after.value',
							dataType: DataTypes.INTEGER,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Warn after',
					name: 'settings.warn_after',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Unit',
							name: 'settings.warn_after.unit',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Day', value: 'day' },
								{ label: 'Hour', value: 'hour' },
								{ label: 'Minute', value: 'minute' },
								{ label: 'Second', value: 'second' }
							]
						},
						{
							label: 'Value',
							name: 'settings.warn_after.value',
							dataType: DataTypes.INTEGER,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Error after',
					name: 'settings.error_after',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Unit',
							name: 'settings.error_after.unit',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Day', value: 'day' },
								{ label: 'Hour', value: 'hour' },
								{ label: 'Minute', value: 'minute' },
								{ label: 'Second', value: 'second' }
							]
						},
						{
							label: 'Value',
							name: 'settings.error_after.value',
							dataType: DataTypes.INTEGER,
							component: ComponentTypes.TEXT_FIELD,
							type: 'number',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				}
			]
		}
	]
} as Schema;

export const TokenAuthenticationForm = {
	name: 'token_authentication_form',
	fields: [
		{
			label: 'Token',
			name: 'token',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const TokenValidationForm = {
	name: 'token_validation_form',
	fields: [
		{
			label: 'Token',
			name: 'token',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const UserForm = {
	name: 'user_form',
	fields: [
		{
			label: 'Email',
			name: 'email',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Password',
			name: 'password',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'First',
					name: 'name.first',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Last',
					name: 'name.last',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		}
	]
} as Schema;

export const AuthenticationForm = {
	name: 'authentication_form',
	fields: [
		{
			label: 'Email',
			name: 'email',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Password',
			name: 'password',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const UserPutForm = {
	name: 'user_put_form',
	fields: [
		{
			label: 'Email',
			name: 'email',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'First',
					name: 'name.first',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Last',
					name: 'name.last',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		}
	]
} as Schema;
