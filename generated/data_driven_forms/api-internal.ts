import ComponentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import DataTypes from '@data-driven-forms/react-form-renderer/dist/cjs/data-types';
import ValidatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import Schema from '@data-driven-forms/react-form-renderer/dist/cjs/schema';

export const AccountPutForm = {
	name: 'account_put_form',
	fields: [
		{
			label: 'Timezone',
			name: 'timezone',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Payment schedule: Union type not supported',
			name: 'payment_schedule',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Payment conditions',
			name: 'payment_conditions',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Deposit rule',
			name: 'deposit_rule',
			component: ComponentTypes.SUB_FORM,
			fields: []
		},
		{
			label: 'Center key',
			name: 'center_key',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const ExplicitStatementDateForm = {
	name: 'explicit_statement_date_form',
	fields: [
		{
			label: 'Date',
			name: 'date',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ManualTransactionForm = {
	name: 'manual_transaction_form',
	fields: [
		{
			label: 'Amount',
			name: 'amount',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Description',
			name: 'description',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Posted at',
			name: 'posted_at',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const AccountContactForm = {
	name: 'account_contact_form',
	fields: [
		{
			label: 'Email',
			name: 'email',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'First name',
			name: 'first_name',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Last name',
			name: 'last_name',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Phone',
			name: 'phone',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const AddressConfigurationSettingForm = {
	name: 'address_configuration_setting_form',
	fields: [
		{
			label: 'Province code',
			name: 'province_code',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Iso 3166 2', value: 'iso_3166_2' },
				{ label: 'Name', value: 'name' }
			]
		}
	]
} as Schema;

export const BackfillForm = {
	name: 'backfill_form',
	fields: [
		{
			label: 'Start date',
			name: 'start_date',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'End date',
			name: 'end_date',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Organization id',
			name: 'organization_id',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Experiment key',
			name: 'experiment_key',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const BankPaymentForm = {
	name: 'bank_payment_form',
	fields: [
		{
			label: 'Account id',
			name: 'account_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Reference',
			name: 'reference',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Sent on',
			name: 'sent_on',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Expected delivery by',
			name: 'expected_delivery_by',
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
		},
		{
			label: 'Transfer transaction ids',
			name: 'transfer_transaction_ids',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const EmailForm = {
	name: 'email_form',
	fields: [
		{
			label: 'To',
			name: 'to',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Cc',
			name: 'cc',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
		},
		{
			label: 'Bcc',
			name: 'bcc',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
		}
	]
} as Schema;

export const BillingStatementReviewForm = {
	name: 'billing_statement_review_form',
	fields: [
		{
			label: 'Reviewed by id',
			name: 'reviewed_by_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Reviewed at',
			name: 'reviewed_at',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const BrowserBundleForm = {
	name: 'browser_bundle_form',
	fields: [
		{
			label: 'Optin',
			name: 'optin',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Country',
					name: 'optin.country',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Country picker',
			name: 'country_picker',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Country',
					name: 'country_picker.country',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Ip',
					name: 'country_picker.ip',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		},
		{
			label: 'Feature',
			name: 'feature',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Keys',
					name: 'feature.keys',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Context',
					name: 'feature.context',
					component: ComponentTypes.SUB_FORM,
					fields: []
				}
			]
		},
		{
			label: 'Payment method',
			name: 'payment_method',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Experience key',
					name: 'payment_method.experience_key',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Country',
					name: 'payment_method.country',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		}
	]
} as Schema;

export const CheckoutSourceOrderForm = {
	name: 'checkout_source_order_form',
	fields: [
		{
			label: 'Source order number',
			name: 'source_order_number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Feature q',
			name: 'feature_q',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const CheckoutConfigurationForm = {
	name: 'checkout_configuration_form',
	fields: [
		{
			label: 'Behavior',
			name: 'behavior',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Shipping address',
					name: 'behavior.shipping_address',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Prompt',
							name: 'behavior.shipping_address.prompt',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Always', value: 'always' },
								{ label: 'Incomplete', value: 'incomplete' }
							]
						}
					]
				},
				{
					label: 'Shipping method',
					name: 'behavior.shipping_method',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Prompt',
							name: 'behavior.shipping_method.prompt',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Always', value: 'always' },
								{ label: 'Multiple', value: 'multiple' }
							]
						}
					]
				},
				{
					label: 'Customer info',
					name: 'behavior.customer_info',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Email',
							name: 'behavior.customer_info.email',
							component: ComponentTypes.SUB_FORM,
							fields: [
								{
									label: 'Prompt',
									name: 'behavior.customer_info.email.prompt',
									component: ComponentTypes.SELECT,
									options: [
										{ label: 'Always', value: 'always' },
										{ label: 'Incomplete', value: 'incomplete' }
									]
								}
							]
						}
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
					label: 'Session persistence timeout',
					name: 'settings.session_persistence_timeout',
					component: ComponentTypes.SUB_FORM,
					fields: []
				},
				{
					label: 'Session persistence attribute keys',
					name: 'settings.session_persistence_attribute_keys',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'Locales',
					name: 'settings.locales',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'Urls',
					name: 'settings.urls',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [
						{
							label: 'Url',
							name: 'url',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Type',
							name: 'type',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Continue shopping', value: 'continue_shopping' },
								{ label: 'Confirmation', value: 'confirmation' },
								{ label: 'Invalid checkout', value: 'invalid_checkout' }
							]
						}
					]
				},
				{
					label: 'Assets',
					name: 'settings.assets',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [
						{
							label: 'Url',
							name: 'url',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Type',
							name: 'type',
							component: ComponentTypes.SELECT,
							options: [
								{ label: 'Stylesheet', value: 'stylesheet' },
								{ label: 'Javascript', value: 'javascript' }
							]
						}
					]
				}
			]
		},
		{
			label: 'Analytics',
			name: 'analytics',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Trackers',
					name: 'analytics.trackers',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: '' }],
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Use base currency',
					name: 'analytics.use_base_currency',
					dataType: DataTypes.BOOLEAN,
					component: ComponentTypes.SWITCH,
					type: 'boolean',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Domain',
			name: 'domain',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const CheckoutFinalizeOrderForm = {
	name: 'checkout_finalize_order_form',
	fields: [
		{
			label: 'Expected order summary',
			name: 'expected_order_summary',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Total',
					name: 'expected_order_summary.total',
					component: ComponentTypes.SUB_FORM,
					fields: []
				}
			]
		},
		{
			label: 'Order put form',
			name: 'order_put_form',
			component: ComponentTypes.SUB_FORM,
			fields: []
		}
	]
} as Schema;

export const CipherForm = {
	name: 'cipher_form',
	fields: [
		{
			label: 'Text',
			name: 'text',
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

export const ProductClassificationJudgementForm = {
	name: 'product_classification_judgement_form',
	fields: [
		{
			label: 'Organization id',
			name: 'organization_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Product id',
			name: 'product_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Classification model id',
			name: 'classification_model_id',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Classification',
			name: 'classification',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Action',
			name: 'action',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Accept', value: 'ACCEPT' },
				{ label: 'Manual', value: 'MANUAL' },
				{ label: 'Reject', value: 'REJECT' }
			]
		}
	]
} as Schema;

export const RequeueRequestForm = {
	name: 'requeue_request_form',
	fields: [
		{
			label: 'Product ids',
			name: 'product_ids',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
		},
		{
			label: 'Hs6 codes',
			name: 'hs6_codes',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
		},
		{
			label: 'Preferred item type',
			name: 'preferred_item_type',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Ignore classification status',
			name: 'ignore_classification_status',
			dataType: DataTypes.BOOLEAN,
			component: ComponentTypes.SWITCH,
			type: 'boolean',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Select mismatching item types',
			name: 'select_mismatching_item_types',
			dataType: DataTypes.BOOLEAN,
			component: ComponentTypes.SWITCH,
			type: 'boolean',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const CompletePriceRule = {
	name: 'complete_price_rule',
	fields: [
		{
			label: 'Price rule',
			name: 'price_rule',
			component: ComponentTypes.SUB_FORM,
			fields: []
		},
		{
			label: 'Discount codes',
			name: 'discount_codes',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: '' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const CustomsDetailsForm = {
	name: 'customs_details_form',
	fields: [
		{
			label: 'Destination',
			name: 'destination',
			component: ComponentTypes.SUB_FORM,
			fields: []
		},
		{
			label: 'Item numbers',
			name: 'item_numbers',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Ship from',
			name: 'ship_from',
			component: ComponentTypes.SUB_FORM,
			fields: []
		}
	]
} as Schema;

export const DeliveredDutyPreferenceForm = {
	name: 'delivered_duty_preference_form',
	fields: [
		{
			label: 'Methods: Array of enum type not supported',
			name: 'methods',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Default',
			name: 'default',
			component: ComponentTypes.SELECT,
			options: []
		},
		{
			label: 'Display',
			name: 'display',
			component: ComponentTypes.SELECT,
			options: []
		}
	]
} as Schema;

export const DiscountCode = {
	name: 'discount_code',
	fields: [
		{
			label: 'Code',
			name: 'code',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ExperimentForm = {
	name: 'experiment_form',
	fields: [
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Description',
			name: 'description',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Variants',
			name: 'variants',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: '' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const FeatureForm = {
	name: 'feature_form',
	fields: [
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Description',
			name: 'description',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Status',
			name: 'status',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Draft', value: 'draft' },
				{ label: 'Active', value: 'active' },
				{ label: 'Archived', value: 'archived' }
			]
		},
		{
			label: 'Type',
			name: 'type',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Boolean', value: 'boolean' },
				{ label: 'Decimal', value: 'decimal' },
				{ label: 'String', value: 'string' }
			]
		},
		{
			label: 'Rules',
			name: 'rules',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: '' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Default: Union type not supported',
			name: 'default',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const FeatureReleaseForm = {
	name: 'feature_release_form',
	fields: [
		{
			label: 'Released at',
			name: 'released_at',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const FeatureStatusForm = {
	name: 'feature_status_form',
	fields: [
		{
			label: 'Status',
			name: 'status',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Draft', value: 'draft' },
				{ label: 'Active', value: 'active' },
				{ label: 'Archived', value: 'archived' }
			]
		}
	]
} as Schema;

export const FeatureValueForm = {
	name: 'feature_value_form',
	fields: [
		{
			label: 'Feature query',
			name: 'feature_query',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Context',
			name: 'context',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Experience key',
					name: 'context.experience_key',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Geo',
					name: 'context.geo',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Country',
							name: 'context.geo.country',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Currency',
							name: 'context.geo.currency',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Language',
							name: 'context.geo.language',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Locale',
							name: 'context.geo.locale',
							component: ComponentTypes.TEXT_FIELD
						},
						{
							label: 'Region',
							name: 'context.geo.region',
							component: ComponentTypes.TEXT_FIELD
						}
					]
				}
			]
		}
	]
} as Schema;

export const FlowCurrencySettingForm = {
	name: 'flow_currency_setting_form',
	fields: [
		{
			label: 'Organization',
			name: 'organization',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
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
		},
		{
			label: 'Rate lock',
			name: 'rate_lock',
			component: ComponentTypes.SUB_FORM,
			fields: []
		}
	]
} as Schema;

export const FlowLabelSettingForm = {
	name: 'flow_label_setting_form',
	fields: [
		{
			label: 'Organization',
			name: 'organization',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Default contents',
			name: 'default_contents',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const FraudReviewDecisionForm = {
	name: 'fraud_review_decision_form',
	fields: [
		{
			label: 'Status',
			name: 'status',
			component: ComponentTypes.SELECT,
			options: []
		}
	]
} as Schema;

export const FtpSettingForm = {
	name: 'ftp_setting_form',
	fields: [
		{
			label: 'Protocol',
			name: 'protocol',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Sftp', value: 'sftp' },
				{ label: 'Ftp', value: 'ftp' }
			]
		},
		{
			label: 'Paths',
			name: 'paths',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Inbound',
					name: 'paths.inbound',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Outbound',
					name: 'paths.outbound',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Username',
			name: 'username',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Password',
			name: 'password',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Host',
			name: 'host',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Intents: Array of enum type not supported',
			name: 'intents',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const GiftCardForm = {
	name: 'gift_card_form',
	fields: [
		{
			label: 'Number',
			name: 'number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Pin',
			name: 'pin',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const GoogleShoppingAccountParameters = {
	name: 'google_shopping_account_parameters',
	fields: [
		{
			label: 'Website url',
			name: 'website_url',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const CheckoutReferenceForm = {
	name: 'checkout_reference_form',
	fields: [
		{
			label: 'Order number',
			name: 'order_number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Order form',
			name: 'order_form',
			component: ComponentTypes.SUB_FORM,
			fields: []
		},
		{
			label: 'Order geo',
			name: 'order_geo',
			component: ComponentTypes.SUB_FORM,
			fields: []
		},
		{
			label: 'Session id',
			name: 'session_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Urls',
			name: 'urls',
			component: ComponentTypes.SUB_FORM,
			fields: []
		},
		{
			label: 'Identifiers',
			name: 'identifiers',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: '' }]
		}
	]
} as Schema;

export const UserStatusForm = {
	name: 'user_status_form',
	fields: [
		{
			label: 'Status',
			name: 'status',
			component: ComponentTypes.SELECT,
			options: []
		}
	]
} as Schema;

export const ItemValuesForm = {
	name: 'item_values_form',
	fields: [
		{
			label: 'Values',
			name: 'values',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const EmailModificationForm = {
	name: 'email_modification_form',
	fields: [
		{
			label: 'Email',
			name: 'email',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const CheckoutLineForm = {
	name: 'checkout_line_form',
	fields: [
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
			type: 'number'
		}
	]
} as Schema;

export const ReservationForm = {
	name: 'reservation_form',
	fields: []
} as Schema;

export const AuthorizationParametersForm = {
	name: 'authorization_parameters_form',
	fields: [
		{
			label: 'Order number',
			name: 'order_number',
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
		},
		{
			label: 'Billing address',
			name: 'billing_address',
			component: ComponentTypes.SUB_FORM,
			fields: []
		},
		{
			label: 'Ip',
			name: 'ip',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const AdyenPaymentDetailsForm = {
	name: 'adyen_payment_details_form',
	fields: [
		{
			label: 'Fingerprint',
			name: 'fingerprint',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Challenge result',
			name: 'challenge_result',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const ContextForm = {
	name: 'context_form',
	fields: []
} as Schema;

export const SessionForm = {
	name: 'session_form',
	fields: []
} as Schema;

export const SessionPutForm = {
	name: 'session_put_form',
	fields: []
} as Schema;

export const ShopifyPromotionForm = {
	name: 'shopify_promotion_form',
	fields: [
		{
			label: 'Code',
			name: 'code',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const Order = {
	name: 'order',
	fields: []
} as Schema;

export const ShopifyExternalCart = {
	name: 'shopify_external_cart',
	fields: []
} as Schema;

export const HarmonizedLandedCostForm = {
	name: 'harmonized_landed_cost_form',
	fields: []
} as Schema;

export const ItemRestrictionPostForm = {
	name: 'item_restriction_post_form',
	fields: [
		{
			label: 'Item numbers',
			name: 'item_numbers',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Regions',
			name: 'regions',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ItemRestrictionPutForm = {
	name: 'item_restriction_put_form',
	fields: [
		{
			label: 'Item number',
			name: 'item_number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Regions',
			name: 'regions',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ItemSalesMarginPostForm = {
	name: 'item_sales_margin_post_form',
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

export const ItemSalesMarginPutForm = {
	name: 'item_sales_margin_put_form',
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

export const LeviesForm = {
	name: 'levies_form',
	fields: [
		{
			label: 'Item',
			name: 'item',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Number',
					name: 'item.number',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Name',
					name: 'item.name',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Categories',
					name: 'item.categories',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'Attributes: Map type not supported',
					name: 'item.attributes',
					component: ComponentTypes.PLAIN_TEXT
				},
				{
					label: 'Description',
					name: 'item.description',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'From',
			name: 'from',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Streets',
					name: 'from.streets',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'Street number',
					name: 'from.street_number',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'City',
					name: 'from.city',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Province',
					name: 'from.province',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Postal',
					name: 'from.postal',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Country',
					name: 'from.country',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'To',
			name: 'to',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Streets',
					name: 'to.streets',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
				},
				{
					label: 'Street number',
					name: 'to.street_number',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'City',
					name: 'to.city',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Province',
					name: 'to.province',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Postal',
					name: 'to.postal',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Country',
					name: 'to.country',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		}
	]
} as Schema;

export const LocalizationForm = {
	name: 'localization_form',
	fields: [
		{
			label: 'Locale',
			name: 'locale',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Status',
			name: 'status',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Draft', value: 'draft' },
				{ label: 'Live', value: 'live' },
				{ label: 'Archived', value: 'archived' }
			]
		},
		{
			label: 'Elements: Map type not supported',
			name: 'elements',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const LocalizedContentElement = {
	name: 'localized_content_element',
	fields: [
		{
			label: 'Value',
			name: 'value',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Type',
			name: 'type',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Markdown', value: 'markdown' },
				{ label: 'Html', value: 'html' },
				{ label: 'Plain text', value: 'plain_text' },
				{ label: 'Href', value: 'href' }
			]
		}
	]
} as Schema;

export const LocalizedContentForm = {
	name: 'localized_content_form',
	fields: [
		{
			label: 'Schema key',
			name: 'schema_key',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Status',
			name: 'status',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Draft', value: 'draft' },
				{ label: 'Live', value: 'live' },
				{ label: 'Archived', value: 'archived' }
			]
		},
		{
			label: 'Source',
			name: 'source',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Locale',
					name: 'source.locale',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Status',
					name: 'source.status',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Draft', value: 'draft' },
						{ label: 'Live', value: 'live' },
						{ label: 'Archived', value: 'archived' }
					]
				},
				{
					label: 'Elements: Map type not supported',
					name: 'source.elements',
					component: ComponentTypes.PLAIN_TEXT
				}
			]
		}
	]
} as Schema;

export const LocalizedItemsExportSettings = {
	name: 'localized_items_export_settings',
	fields: [
		{
			label: 'Full export schedule: Union type not supported',
			name: 'full_export_schedule',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Delta export schedule: Union type not supported',
			name: 'delta_export_schedule',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const InputForm = {
	name: 'input_form',
	fields: []
} as Schema;

export const MarketingGatewayChannelForm = {
	name: 'marketing_gateway_channel_form',
	fields: [
		{
			label: 'Platform',
			name: 'platform',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Google', value: 'google' },
				{ label: 'Facebook', value: 'facebook' }
			]
		},
		{
			label: 'Account id',
			name: 'account_id',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const MarketingGatewayFacebookConnectionForm = {
	name: 'marketing_gateway_facebook_connection_form',
	fields: [
		{
			label: 'Access token',
			name: 'access_token',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const MarketingGatewayFeedForm = {
	name: 'marketing_gateway_feed_form',
	fields: [
		{
			label: 'Schema id',
			name: 'schema_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Filter id',
			name: 'filter_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
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
			label: 'Feed source: Union type not supported',
			name: 'feed_source',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Distribution channel: Union type not supported',
			name: 'distribution_channel',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const MarketingGatewayFeedExportForm = {
	name: 'marketing_gateway_feed_export_form',
	fields: [
		{
			label: 'Feed ids',
			name: 'feed_ids',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }],
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

export const MarketingGatewayFeedFormRequest = {
	name: 'marketing_gateway_feed_form_request',
	fields: [
		{
			label: 'Feed source: Union type not supported',
			name: 'feed_source',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Schema compatibility',
			name: 'schema_compatibility',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Google', value: 'google' },
				{ label: 'Facebook master', value: 'facebook_master' },
				{ label: 'Facebook country override', value: 'facebook_country_override' }
			]
		}
	]
} as Schema;

export const MarketingGatewayGoogleConnectionForm = {
	name: 'marketing_gateway_google_connection_form',
	fields: [
		{
			label: 'Access token',
			name: 'access_token',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Refresh token',
			name: 'refresh_token',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const Notification = {
	name: 'notification',
	fields: [
		{
			label: 'Order',
			name: 'order',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Id',
					name: 'order.id',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Status',
					name: 'order.status',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Old status',
					name: 'order.old_status',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Description',
					name: 'order.description',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Category',
					name: 'order.category',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Shop url',
					name: 'order.shop_url',
					component: ComponentTypes.TEXT_FIELD
				}
			]
		}
	]
} as Schema;

export const OptinAttributeForm = {
	name: 'optin_attribute_form',
	fields: [
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Optin attribute key',
			name: 'optin_attribute_key',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Target',
			name: 'target',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Browse', value: 'browse' },
				{ label: 'Checkout', value: 'checkout' }
			]
		},
		{
			label: 'Status',
			name: 'status',
			component: ComponentTypes.SELECT,
			options: []
		}
	]
} as Schema;

export const OptinPromptForm = {
	name: 'optin_prompt_form',
	fields: [
		{
			label: 'Optin attribute key',
			name: 'optin_attribute_key',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Region',
			name: 'region',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Options: Array of enum type not supported',
			name: 'options',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Content',
			name: 'content',
			component: ComponentTypes.SUB_FORM,
			fields: []
		},
		{
			label: 'Position',
			name: 'position',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Enforce on',
			name: 'enforce_on',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Display: Union type not supported',
			name: 'display',
			component: ComponentTypes.PLAIN_TEXT
		}
	]
} as Schema;

export const OrganizationMembershipCopyForm = {
	name: 'organization_membership_copy_form',
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
		}
	]
} as Schema;

export const OrganizationSettingsForm = {
	name: 'organization_settings_form',
	fields: [
		{
			label: 'Default currency format symbol',
			name: 'default_currency_format_symbol',
			component: ComponentTypes.SELECT,
			options: []
		},
		{
			label: 'Default currency label formatters: Array of enum type not supported',
			name: 'default_currency_label_formatters',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Order action rules',
			name: 'order_action_rules',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Trigger',
					name: 'trigger',
					component: ComponentTypes.SELECT,
					options: [
						{ label: 'Zero balance', value: 'zero_balance' },
						{ label: 'Unsubmitted order', value: 'unsubmitted_order' }
					]
				},
				{
					label: 'Actions: Array of enum type not supported',
					name: 'actions',
					component: ComponentTypes.PLAIN_TEXT
				}
			]
		},
		{
			label: 'Respect item margins on override',
			name: 'respect_item_margins_on_override',
			dataType: DataTypes.BOOLEAN,
			component: ComponentTypes.SWITCH,
			type: 'boolean',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Respect item sales margins on override',
			name: 'respect_item_sales_margins_on_override',
			dataType: DataTypes.BOOLEAN,
			component: ComponentTypes.SWITCH,
			type: 'boolean',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Respect session currency',
			name: 'respect_session_currency',
			dataType: DataTypes.BOOLEAN,
			component: ComponentTypes.SWITCH,
			type: 'boolean',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const PartnerForm = {
	name: 'partner_form',
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
			options: []
		},
		{
			label: 'Parent id',
			name: 'parent_id',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const PartnerAuthorizationForm = {
	name: 'partner_authorization_form',
	fields: [
		{
			label: 'Partner',
			name: 'partner',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Environment',
			name: 'environment',
			component: ComponentTypes.SELECT,
			options: []
		}
	]
} as Schema;

export const PartnerMembershipForm = {
	name: 'partner_membership_form',
	fields: [
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
			options: []
		}
	]
} as Schema;

export const PartnerMembershipPutForm = {
	name: 'partner_membership_put_form',
	fields: [
		{
			label: 'Role',
			name: 'role',
			component: ComponentTypes.SELECT,
			options: []
		}
	]
} as Schema;

export const PartnerOrganizationAuthorizationForm = {
	name: 'partner_organization_authorization_form',
	fields: [
		{
			label: 'Partner',
			name: 'partner',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const PassphraseForm = {
	name: 'passphrase_form',
	fields: [
		{
			label: 'Tribe',
			name: 'tribe',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Current password',
			name: 'current_password',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'New password',
			name: 'new_password',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const AuthenticationForm = {
	name: 'authentication_form',
	fields: [
		{
			label: 'Password',
			name: 'password',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ClassicPaymentRedirectForm = {
	name: 'classic_payment_redirect_form',
	fields: [
		{
			label: 'Md',
			name: 'MD',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Pares',
			name: 'PaRes',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ProductHarmonizationForm = {
	name: 'product_harmonization_form',
	fields: [
		{
			label: 'Product labels',
			name: 'product_labels',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Item type',
					name: 'product_labels.item_type',
					component: ComponentTypes.TEXT_FIELD,
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Gender',
					name: 'product_labels.gender',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Value',
							name: 'product_labels.gender.value',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Unverified',
							name: 'product_labels.gender.unverified',
							dataType: DataTypes.BOOLEAN,
							component: ComponentTypes.SWITCH,
							type: 'boolean',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Material',
					name: 'product_labels.material',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Value',
							name: 'product_labels.material.value',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Unverified',
							name: 'product_labels.material.unverified',
							dataType: DataTypes.BOOLEAN,
							component: ComponentTypes.SWITCH,
							type: 'boolean',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				},
				{
					label: 'Construction',
					name: 'product_labels.construction',
					component: ComponentTypes.SUB_FORM,
					fields: [
						{
							label: 'Value',
							name: 'product_labels.construction.value',
							component: ComponentTypes.TEXT_FIELD,
							validate: [{ type: ValidatorTypes.REQUIRED }]
						},
						{
							label: 'Unverified',
							name: 'product_labels.construction.unverified',
							dataType: DataTypes.BOOLEAN,
							component: ComponentTypes.SWITCH,
							type: 'boolean',
							validate: [{ type: ValidatorTypes.REQUIRED }]
						}
					]
				}
			]
		},
		{
			label: 'Customs description',
			name: 'customs_description',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const RatecardStandardConfigurationForm = {
	name: 'ratecard_standard_configuration_form',
	fields: [
		{
			label: 'Source ratecard organization',
			name: 'source_ratecard_organization',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Source ratecard number',
			name: 'source_ratecard_number',
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

export const ScreenForm = {
	name: 'screen_form',
	fields: [
		{
			label: 'Q',
			name: 'q',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Key',
			name: 'key',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Country',
			name: 'country',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const SessionCountryForm = {
	name: 'session_country_form',
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

export const SessionRolloutForm = {
	name: 'session_rollout_form',
	fields: [
		{
			label: 'Percent',
			name: 'percent',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ShopForm = {
	name: 'shop_form',
	fields: [
		{
			label: 'Organization id',
			name: 'organization_id',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const InstallForm = {
	name: 'install_form',
	fields: [
		{
			label: 'Token',
			name: 'token',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ShopifyGiftCardBalanceForm = {
	name: 'shopify_gift_card_balance_form',
	fields: [
		{
			label: 'Number',
			name: 'number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ShopifyGiftCardRedemptionForm = {
	name: 'shopify_gift_card_redemption_form',
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

export const ShopifyGiftCardReversalForm = {
	name: 'shopify_gift_card_reversal_form',
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

export const InternalOrder = {
	name: 'internal_order',
	fields: []
} as Schema;

export const ShopifyCodeForm = {
	name: 'shopify_code_form',
	fields: [
		{
			label: 'Code',
			name: 'code',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const ShopifyGiftCardPaymentForm = {
	name: 'shopify_gift_card_payment_form',
	fields: [
		{
			label: 'Code',
			name: 'code',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Customer id',
			name: 'customer_id',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		}
	]
} as Schema;

export const ShopifyPromoForm = {
	name: 'shopify_promo_form',
	fields: [
		{
			label: 'Name',
			name: 'name',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Starts at',
			name: 'starts_at',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Ends at',
			name: 'ends_at',
			component: ComponentTypes.TEXT_FIELD
		},
		{
			label: 'Status',
			name: 'status',
			component: ComponentTypes.SELECT,
			options: [
				{ label: 'Active', value: 'active' },
				{ label: 'Inactive', value: 'inactive' }
			]
		},
		{
			label: 'Rule',
			name: 'rule',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Prerequisites',
					name: 'rule.prerequisites',
					component: ComponentTypes.FIELD_ARRAY,
					fields: [{ component: '' }],
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
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
						},
						{
							label: 'Max',
							name: 'max',
							component: ComponentTypes.FIELD_ARRAY,
							fields: [{ component: '' }]
						}
					],
					validate: [{ type: ValidatorTypes.REQUIRED }]
				}
			]
		},
		{
			label: 'Stackable limit',
			name: 'stackable_limit',
			dataType: DataTypes.INTEGER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number'
		}
	]
} as Schema;

export const StoreConnectionForm = {
	name: 'store_connection_form',
	fields: [
		{
			label: 'Organization',
			name: 'organization',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const MagentoInstallForm = {
	name: 'magento_install_form',
	fields: [
		{
			label: 'Token',
			name: 'token',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const TaxCalculationForm = {
	name: 'tax_calculation_form',
	fields: [
		{
			label: 'Order number',
			name: 'order_number',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Target currency code',
			name: 'target_currency_code',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Destination',
			name: 'destination',
			component: ComponentTypes.SUB_FORM,
			fields: []
		},
		{
			label: 'Order date',
			name: 'order_date',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Lines',
			name: 'lines',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
				{
					label: 'Line number',
					name: 'line_number',
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
					label: 'Ship from',
					name: 'ship_from',
					component: ComponentTypes.SUB_FORM,
					fields: []
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
					label: 'Amount',
					name: 'amount',
					dataType: DataTypes.NUMBER,
					component: ComponentTypes.TEXT_FIELD,
					type: 'number',
					validate: [{ type: ValidatorTypes.REQUIRED }]
				},
				{
					label: 'Tax code',
					name: 'tax_code',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Sku',
					name: 'sku',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Description',
					name: 'description',
					component: ComponentTypes.TEXT_FIELD
				},
				{
					label: 'Category code',
					name: 'category_code',
					component: ComponentTypes.TEXT_FIELD
				}
			],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Shipping amount',
			name: 'shipping_amount',
			dataType: DataTypes.NUMBER,
			component: ComponentTypes.TEXT_FIELD,
			type: 'number',
			validate: [{ type: ValidatorTypes.REQUIRED }]
		},
		{
			label: 'Customer code',
			name: 'customer_code',
			component: ComponentTypes.TEXT_FIELD
		}
	]
} as Schema;

export const OneTimeTokenRedemptionForm = {
	name: 'one_time_token_redemption_form',
	fields: [
		{
			label: 'Token',
			name: 'token',
			component: ComponentTypes.TEXT_FIELD,
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;

export const CheckoutSubmissionForm = {
	name: 'checkout_submission_form',
	fields: [
		{
			label: 'Authorization form: Union type not supported',
			name: 'authorization_form',
			component: ComponentTypes.PLAIN_TEXT
		},
		{
			label: 'Expected order summary',
			name: 'expected_order_summary',
			component: ComponentTypes.SUB_FORM,
			fields: [
				{
					label: 'Total',
					name: 'expected_order_summary.total',
					component: ComponentTypes.SUB_FORM,
					fields: []
				}
			]
		},
		{
			label: 'Feature keys',
			name: 'feature_keys',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [{ component: 'ComponentTypes.TEXT_FIELD' }]
		}
	]
} as Schema;

export const CheckoutLinesForm = {
	name: 'checkout_lines_form',
	fields: [
		{
			label: 'Lines',
			name: 'lines',
			component: ComponentTypes.FIELD_ARRAY,
			fields: [
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
					type: 'number'
				}
			],
			validate: [{ type: ValidatorTypes.REQUIRED }]
		}
	]
} as Schema;
