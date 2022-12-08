const express = require("express");
const app = express();
const { resolve } = require("path");
// This is your real test secret API key.
const stripe = require("stripe")("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");
app.use(express.static("."));
app.use(express.json());
const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 200;
};
app.post("/create-payment-intent", async (req, res) => {
  const { currency } = req.body;
  console.log(currency)

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 10000,
    currency: currency
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
});
app.get('/greet',(req,res)=>{
  res.send("It is working fine")
})

app.get("/test",(req,res)=>{
  res.send("It is working fine")
})

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-08-01'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 10000,
    currency: 'INR',
    customer: customer.id,
    payment_method_types: ['card']  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: "pk_live_51M0SpXCSNniMvPRn9UJEnvEEUoTukerDRmDLBdfJhqBmMWwkaV5MuhMkc25UycEPxEnYp0dxFd3BaUx7li4tjUYu003qcRLgGy"

  });
});

const PORT = 80;
app.listen(PORT, () => console.log('Node server listening on port ${PORT}'));
