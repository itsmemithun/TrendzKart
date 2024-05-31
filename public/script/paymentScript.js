const proceedToPayment = document.querySelector(".proceedToPayment");
const checkStatus = document.querySelector(".checkStatus");
const price = document.querySelector('.endPrice').innerHTML;

proceedToPayment.addEventListener('click', submitForm);
// checkStatus.addEventListener('click', checkApi);

const productId = proceedToPayment.getAttribute("productIdData");

function initiateUpiPayment(){
 
  const res = fetch(`/view/buy/${productId}/proceedToPayment`,{
    method : "POST",
    headers: {
      "Content-type" : "application/json"
    },
    body : JSON.stringify({
       testing : "hello",
       amount : price
    })
  })
  res.then((response)=>{
    return response.json();
  })
  .then((data)=>{
    console.log(data.result);
    window.location.href = `${data.result}`;
  })

}

function initiateCodPayment(){
    const res = fetch(`/view/buy/${productId}/proceedToCodPayment`,{
      method : "POST",
      headers : {
        "constent-type" : "application/json"
      },
      body : JSON.stringify({

      })
    })
    res.then((response)=>{
      return response.json(); 
    }).then((data)=>{
      console.log(data.result.id);
      window.location.href = `/orderSuccess/${data.paymentMethod}/${data.result.id}`;
    })
}

function initiateDebitCard(){
  console.log('debit card payment');
}

function submitForm(event){
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

function checkApi(){
  console.log('checkapi');
}
