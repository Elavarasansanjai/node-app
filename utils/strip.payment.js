// server.js
const stripe = require('stripe')(process.env.SKIPE_SECRET_KEY);

const stripPayment = async ( payment ,amount) => {
    try {
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'inr',
            automatic_payment_methods: {enabled: true},
        });
        
        return { sts : true, message: 'Payment initiated', paymentIntent};
      } catch (error) {
        return error;
      }
} 

module.exports =  stripPayment