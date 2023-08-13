import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import userAxios from "../../../Axios/userAxios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#333",
      fontWeight: 500,
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

export default function PaymentForm() {
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const token = useSelector((store) => store.user.Token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;

        const response = await userAxios.post(
          "/payment",
          {
            amount: 1500,
            currency: "inr",
            id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setSuccess(true);
        }
      } catch (error) {
        console.log("error", error);
      }
    } else {
      console.log(error.message);
    }
  };

  return (
    <div className="payment-form">
      {!success ? (
        <form className="" onSubmit={handleSubmit}>
          <div className="card-element">
            <CardElement options={CARD_OPTIONS} />
          </div>
          <button className="pay-button" type="submit">
            Pay Now
          </button>
        </form>
      ) : (
        <div className="success-message">
          <h2>Congratulations!</h2>
          <p>You've successfully made a payment.</p>
        </div>
      )}
    </div>
  );
}
