const proceedToPayment = document.querySelector(".proceedToPayment");
const checkStatus = document.querySelector(".checkStatus");
// const price = document.querySelector('.endPrice').innerHTML;
proceedToPayment.addEventListener('click', submitForm);
// checkStatus.addEventListener('click', checkApi);



// async function getPrice(){
//     const response = await fetch(`/user/getproductprice`,{
//         method : "POST",
//         headers : {
//           "Content-type" : "application/json"
//         },
//         body : JSON.stringify({
//           productid : productId
//         })
//       })
//       let data = await response.json();
//       return data.result;  
//     }


function createOrder(paymentMethod,productId){
  const res = fetch(`/orderCompletion/${paymentMethod}`,{
    method : "POST",
    headers : {
      "Content-type" : "application/json"
    },
    body : JSON.stringify({
      productId : productId
    })
  })
  res.then((response)=>{
    return response.json();
  })
  .then((data)=>{
     console.log(data);
  })
}
   
 function initiateUpiPayment(){
  const res = fetch(`/view/buy/${productId}/proceedToPayment`,{
    method : "POST",
    headers: {
      "Content-type" : "application/json"
    },
    body : JSON.stringify({
       amount : price
    })
  })
  res.then((response)=>{
    return response.json();
  })
  .then((data)=>{
    window.location.href = `${data.result}`;
  })
}

function initiateCodPayment(){
    const productId = proceedToPayment.getAttribute("productIdData");
    const res = fetch(`/view/buy/proceedToCodPayment`,{
      method : "POST",
      headers : {
        "Content-type" : "application/json"
      },
      body : JSON.stringify({
          productId : productId
      })
    })
    res.then((response)=>{
      return response.json(); 
    }).then((data)=>{
      createOrder(data.paymentMethod,data.result.id);
    })
}



function initiateDebitCard(){
  console.log('debit card payment');
}

async function submitForm(event){
   event.preventDefault();
   let form = document.getElementById('paymentForm');
   let formData = new FormData(form);
   let paymentMethod = formData.get("paymentSelect");
   if(paymentMethod == 'COD'){
    initiateCodPayment();
   }else if(paymentMethod == 'UPI'){
    initiateUpiPayment();
   }else if(paymentMethod == 'Debit Card'){
    initiateDebitCard();
   }
}

