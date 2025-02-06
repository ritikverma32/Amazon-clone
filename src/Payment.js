import React, { useEffect, useState } from 'react';
import "./Payment.css";
import { useStateValue } from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
import { Link, useNavigate } from 'react-router-dom';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import axios from 'axios';
import {db} from "./firebase";

function Payment() {

    const [{basket, user}, dispatch] = useStateValue();
    const history = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [clientSecret, setClientSecret] = useState(true);



    const getClientSecret = async () => {
        try{
            const response = await axios.post(`/payment/create?total=${getBasketTotal(basket)*100}`);
            setClientSecret(response.data.clientSecret)
            console.log(response);
        }
        catch(error){
            console.log(error)
        }
        
    }

    useEffect(() => {
        //generate the special stripe which allows us to charge a customer
       

        getClientSecret();
    }, [basket])

    console.log(clientSecret)
    console.log(user)

    const handleSubmit = async (event) => {

        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method:  {
                card: elements.getElement(CardElement)
            }
        }).then(({paymentIntent}) => {
            //paymentIntent = payment confirmation

            db 
                .collection('users')
                .doc(user?.uid)
                .collection('orders')
                .doc(paymentIntent.id)
                .set({
                    basket: basket,
                    amount: paymentIntent.amount,
                    created: paymentIntent.created
                })

            setSucceeded(true);
            setError(null)
            setProcessing(false)

            dispatch({
                type: 'EMPTY_BASKET'
            })

            history.replace('/orders')
        })

    }

    const handleChange = event => {
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }

  return (
    <div className='payment'>
        <div className='paymemt_container'>
            <h1>
                Checkout (<Link to="/checkout">{basket?.length}items</Link>)
            </h1>
            {/* delivery address */}
            <div className='payment_section'>
                <div className='payment_title'>
                    <h3>Delivery Address</h3>
                </div>
                <div className='payment_address'>
                    <p>{user?.email}</p>
                    <p>123 React Lane</p>
                    <p>Los Angeles, CA</p>
                </div>
            </div>

            {/* Review Items */}
            <div className='payment_section'>
                <div className='payment_title'>
                    <h3>Review items and delivery</h3>
                </div>
                <div className='payment_items'>
                    {basket.map(item => (
                        <CheckoutProduct
                            id={item.id}
                            title={item.title}
                            image={item.image}
                            price={item.price}
                            rating={item.rating}
                        />
                    ))}
                </div>
            </div>

            {/* payment method */}
            <div className='payment_section'>
                <div className='payment_title'>
                     <h3>Payment Method</h3>
                </div>
                <div className='payment_details'>
                    
                    <form onSubmit={handleSubmit}>
                        <CardElement onChange={handleChange}/>

                        <div className='payment_priceContainer'>
                            <CurrencyFormat
                                renderText={(value) => (
                                    <>
                                    <h3>Order Total: {value}</h3>
                                    </>
                                )}
                                decimalScale={2}
                                value={getBasketTotal(basket)}
                                displayType='text'
                                thousandSeparator={true}
                                prefix='$'
                            />
                            <button disabled={processing || disabled ||
                            succeeded}>
                                <span>{processing ? <p>Processing</p> :
                                "Buy Now"}</span>
                            </button>
                        </div>

                        {error && <div>{error}</div>}
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Payment