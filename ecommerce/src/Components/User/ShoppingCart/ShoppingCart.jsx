import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import ShoppingCartService from '../../../Services/CommonService/ShoppingCartService'
import ShopOrderService from '../../../Services/CommonService/ShopOrderService'
import ProductItemLine from './ProductItemLine'
import PaypalCheckout from "./PaypalCheckout"
import "./ShoppingCart.css"
import UserContext from '../UserContext'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PaymentService from '../../../Services/CommonService/PaymentService'

export default function ShoppingCart() {

  const context = useContext(UserContext);
  const [payment, setPayment] = useState({id: 1});
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(()=>{
      PaymentService.getAllPaymentMethod().then(res=>{
          console.log(res.data);
          setPaymentMethods(res.data);
          setPayment(res.data[0]);
      });
  },[])

  function changePaymentMethod(event) {
    let value = event.currentTarget.value;
    let pay = paymentMethods.filter(p => Number(p.id) === Number(value));
    pay = pay[0];
    setPayment(pay);
  }

  const siteUser = context.siteUser;
  const shoppingCart = context.shoppingCart;
  const setShoppingCart = context.setShoppingCart;

  function pay() {
    if (shoppingCart.shoppingCartItems.length > 0)
      ShopOrderService.createNewShopOders(siteUser, shoppingCart.shoppingCartItems, siteUser.addresses[0].address, payment).then(response => {
        console.log(response.data);
        setShoppingCart({ ...shoppingCart, shoppingCartItems: [] });
      });
  }

  function totalPay() {
    let price = 0;
    shoppingCart.shoppingCartItems?.forEach(line => {
      price += line.qty * line.productItem.price;
    });
    return price;
  }

  function howManyProductItems() {
    let howMany = 0;
    shoppingCart.shoppingCartItems?.forEach(line => {
      howMany += line.qty;
    });
    return howMany;
  }

  return (
    <Container className='border border-dark rounded p-1 mt-1 mb-1' style={{ backgroundColor: "#212529" }}>
      <div>
        <h2 className="title-page"><span><ShoppingCartIcon className='icon' />Orders</span></h2>
      </div>
      <div className='order-list'>
        <table className='shopping-cart-table'>
          <thead>
            <tr>
              <th>No.</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Sum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              shoppingCart.shoppingCartItems?.length > 0 ?
                shoppingCart.shoppingCartItems?.map((productItem, index) => <ProductItemLine key={index} no={index} productLine={productItem} cartId={shoppingCart.id} />)
                :
                <tr>
                  <td colSpan={7} className='p-2'>We don't have any product items in this cart!</td>
                </tr>
            }
          </tbody>
          <tfoot>
            <tr>
              <td className='p-2 fw-bold'> Number </td>
              <td className='p-2 fst-italic' colSpan={2}> {howManyProductItems()} product item (s)</td>
              <td className='p-2 fw-bold'> Total </td>
              <td className='price-color p-2' colSpan={3} >{Intl.NumberFormat('en-US', { style: "currency", currency: "USD" }).format(totalPay())}</td>

            </tr>
          </tfoot>
        </table>
        <div className="payment-container mt-1">
          <div className='method bg-white p-1 ps-2 pe-2'>
            <span className='fw-bold'>Payment Method</span>
            <select value={payment.id} onChange={(event) => changePaymentMethod(event)}>
              {
                paymentMethods.length > 0
                ? paymentMethods.map((p, index)=><option key={index} value={p.id}>{p.name}</option>)
                : <option value={0}>No</option>
              }
            </select>
          </div>
          <div>
            {
              Number(payment.id) === 1
                ? <button className="btn btn-success pay" onClick={pay}>Pay</button>
                : <PaypalCheckout description={"Payment"} getPrice={totalPay} afterPay={pay}></PaypalCheckout>
            }
          </div>
        </div>
      </div>

    </Container>
  )
}
