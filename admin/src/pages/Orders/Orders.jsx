import React, { useEffect, useState } from 'react'
import './Orders.css'
import axios from 'axios'
import {toast} from 'react-toastify'
import {assets} from '../../assets/assets'

const Orders = ({url}) => {

  const [orders,setOrders] = useState([]);
  
  const fetchAllOrders = async () =>{
    const response = await axios.get(url+"/api/order/list");
    if (response.data.success) {
      let data = response.data.data || [];
      if (Array.isArray(data)) {
        data = data.map(o => {
          if (o && o.amount && o.amount.$numberDecimal) {
            return { ...o, amount: parseFloat(o.amount.$numberDecimal) };
          }
          return o;
        });
      }
      setOrders(data);
      console.log(data);
    }
    else{
      toast.error("Error")
    }
  }

  const removeOrder = async (orderId) => {
    try {
      const res = await axios.post(url + "/api/order/remove", { orderId });
      if (res.data.success) {
        toast.success(res.data.message || 'Order deleted');
        await fetchAllOrders();
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting order');
    }
  }

  const statusHandler = async (event,orderId)=>{
    const response = await axios.post(url + "/api/order/status",{
      orderId,
      status:event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
    }
  }


  useEffect(()=>{
    fetchAllOrders();
  },[])

  return (
    <div className='order-add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order,index)=>(
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt='parcel_icon'/>
            <div>
              <p className='order-item-food'>
                {order.items.map((item,index)=>{
                  if (index===order.items.length-1) {
                    return item.name + " x " + item.quantity
                  }
                  else{
                    return item.name + " x " + item.quantity + " , "
                  }
                })}

              </p>
              <p className='order-item-name'>{order.address.firstName +" " + order.address.lastName}</p>
              <div className="order-item-address">
                <p>{order.address.street+","}</p>
                <p>{order.address.city+", "+order.address.state+", "+order.address.country+", "+order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>Rs.{order.amount}</p>
            <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
            {order.status === 'Delivered' && (
              <button className="remove-order" onClick={()=>removeOrder(order._id)}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders