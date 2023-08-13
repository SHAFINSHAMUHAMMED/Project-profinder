import React from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../stripe/payform"; // not implemented yet

const public_key = 'pk_test_51NcNkESHxd1ahKFjA7JWdDGEJyfQeFgz94iiAJW1gVqHSZduAGhURHwCnVJogI7xkcHU3M0XX6zyci08Ms6YAYuh00cye19MHj';
const stripeTestPromise = loadStripe(public_key);

function Stripe() {
  return (
    <div>
      <Elements stripe={stripeTestPromise}>
        <PaymentForm /> 
      </Elements>
    </div>
  );
}

export default Stripe;
