const orderDetails = document.getElementsByClassName('orderDetails');



for(let orderDetail of orderDetails){
  orderDetail.addEventListener('click',getOrderDetails)
}


function getOrderDetails(){
   const  orderId = this.getAttribute('data_orderId');
   const res = fetch('/user/getorderdetails',{
     method : "POST",
     headers : {
        "Content-type" : "application/json"
     },
     body : JSON.stringify({
         orderId : orderId
     })
   })
   res.then((response)=>{
    return response.json();
   })
   .then((data)=>{
    const orderId = data.result[0].orderId;
    document.querySelector('.orderId').textContent = data.result[0].orderId;
    document.querySelector('.orderAmount').textContent = data.result[0].orderAmount;
    document.querySelector('.paymentMethod').textContent = data.result[0].paymentMethod;
    document.querySelector('.orderStatus').textContent = data.result[0].status;
    document.querySelector('.paymentStatus').textContent = data.result[0].paymentStatus;
    document.querySelector('.orderPlacedOn').textContent = data.result[0].dateOfOrderPlaced;
    if(data.result[0].cancelRequested == true || data.result[0].returnRequested  == true){
      document.querySelector('.returnRequestBtn').classList.add('d-none');
      document.querySelector('.cancelRequestBtn').classList.add('d-none');
    }
    document.querySelector('.returnRequestBtn').setAttribute('href', `/user/myorders/return/${orderId}`);
    document.querySelector('.cancelRequestBtn').setAttribute('href', `/user/myorders/cancel/${orderId}`);
   })
}