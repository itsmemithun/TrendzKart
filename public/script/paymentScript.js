const proceedToPayment = document.querySelector(".proceedToPayment");
const checkStatus = document.querySelector(".checkStatus");
// const price = document.querySelector('.endPrice').innerHTML;
proceedToPayment.addEventListener('click', submitForm);
// checkStatus.addEventListener('click', checkApi);

const productId = proceedToPayment.getAttribute("productIdData");

async function getPrice(){
    const response = await fetch(`/user/getproductprice`,{
        method : "POST",
        headers : {
          "Content-type" : "application/json"
        },
        body : JSON.stringify({
          productid : productId
        })
      })
      let data = await response.json();
      return data.result;  
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

function initiateCodPayment(price){
    const res = fetch(`/view/buy/proceedToCodPayment`,{
      method : "POST",
      headers : {
        "Content-type" : "application/json"
      },
      body : JSON.stringify({
          price : price,
          productId : productId
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

async function submitForm(event){
   event.preventDefault();
   let form = document.getElementById('paymentForm');
   let formData = new FormData(form);
   let paymentMethod = formData.get("paymentSelect");
   let priceData = await getPrice();
   if(paymentMethod == 'COD'){
    initiateCodPayment(priceData);
   }else if(paymentMethod == 'UPI'){
    initiateUpiPayment();
   }else if(paymentMethod == 'Debit Card'){
    initiateDebitCard();
   }
}

