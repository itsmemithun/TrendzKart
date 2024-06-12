const productdecrementbtns = document.querySelectorAll(".productcountdecrementbtn");
const productincrementbtns = document.querySelectorAll(".productcountincrementbtn");
const productcounts = document.querySelectorAll(".productcount");
const productsum = document.querySelector(".product-sum");
const cartPaymentBtn = document.querySelector(".cartProceedToPayment");
const productIds = document.getElementsByClassName('product-name');

let cartProductIds = [];

async function getPrice(productId){
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

  function initiateCodPayment(price){
    const res = fetch(`/view/buy/proceedToCodPayment`,{
      method : "POST",
      headers : {
        "Content-type" : "application/json"
      },
      body : JSON.stringify({
          price : price,
          productId : cartProductIds
      })
    })
    res.then((response)=>{
      return response.json(); 
    }).then((data)=>{
      console.log(data.result.id);
      window.location.href = `/orderSuccess/${data.paymentMethod}/${data.result.id}`;
    })
}  

for(let product of productIds){
  cartProductIds.push(product.getAttribute('data-product-id'));
}


cartPaymentBtn.addEventListener('click', submitForm);

async function submitForm(event){
  let endPrice = 0;
  event.preventDefault();
  let form = document.getElementById('paymentForm');
  let formData = new FormData(form);
  let paymentMethod = formData.get("paymentSelect");
  for(let i=0; i<cartProductIds.length; i++){
  endPrice += await getPrice(cartProductIds[i]);
  }
  console.log(endPrice);
  if(paymentMethod == 'COD'){
   initiateCodPayment(endPrice);
  }else if(paymentMethod == 'UPI'){
   initiateUpiPayment();
  }else if(paymentMethod == 'Debit Card'){
   initiateDebitCard();
  }
}

// Product Quantity Increase Button //
for(let productincrementbtn of productincrementbtns ){
    productincrementbtn.addEventListener('click', function(){
     const btnGrp = this.closest(".prdQuantityWraper");
     const productcount = btnGrp.querySelector(".productcount");
     let count = parseInt(productcount.value) || 1;
     count++;
     productcount.value = count;
     console.log(productcount.value);
     const productId = this.closest(".productName");
     const productid = productId.getAttribute("data-product-id");
     const result = fetch('/user/getproductprice' ,{
       method : "POST",
       headers : {
         "Content-type" : "application/json"
       },
       body : JSON.stringify({
         productid : productid
       })
     })
     result.then((response)=>{
      return response.json();
     })
     .then((data)=>{
      console.log(data);
      productsum.innerHTML = `₹${parseInt(data.result) * productcount.value}`;
     })
    })
}

// Product Quantity Decrease Button //
for(let productdecrementbtn of productdecrementbtns){
  productdecrementbtn.addEventListener('click', function(){
    const btnGrp = this.closest(".prdQuantityWraper");
    const productcount = btnGrp.querySelector(".productcount");
    let count = productcount.value;  
  if(count>1){
    count--;
    productcount.value = count;
    const productId = this.closest(".productName");
    const productid = productId.getAttribute("data-product-id");
    const result = fetch('/user/getproductprice' ,{
      method : "POST",
      headers : {
        "Content-type" : "application/json"
      },
      body : JSON.stringify({
        productid : productid
      })
    })
    result.then((response)=>{
     return response.json();
    })
    .then((data)=>{
     console.log(data);
     productsum.innerHTML = `₹${parseInt(productsum.innerHTML.replace("₹", "")) - parseInt(data.result)}`;
    })
  }
  })
}



