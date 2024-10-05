const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

const environment = new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
const paypalClient = new checkoutNodeJssdk.core.PayPalHttpClient(environment);

module.exports = { paypalClient };
