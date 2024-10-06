const productdecrementbtns = document.querySelectorAll(".productcountdecrementbtn");
const productincrementbtns = document.querySelectorAll(".productcountincrementbtn");
const productcounts = document.querySelectorAll(".productcount");
const productsum = document.querySelector(".product-sum");
const cartPaymentBtn = document.querySelector(".cartProceedToPayment");
const productIds = document.getElementsByClassName('product-name');
const couponApplyBtn = document.querySelector('.couponApplyBtn');
const couponInput = document.querySelector('.couponInput');
const subtotal = document.querySelector('.subtotalValue');
const couponValue = document.querySelector('.coupon');
const addressWarning = document.querySelector('.addressWarning');
const address = document.getElementById('addressCheckBox');
const modal = document.querySelector('.modal');
const checkOutBtn = document.querySelector('.checkOutBtn');
const modal2 = document.getElementById('checkoutPaymentModal');
const addressWarningText = document.querySelector('.selectAddressWarning');
const addressForm = document.getElementById('addressForm');

function createOrder(paymentMethod,productId,address){
  
  const res = fetch(`/orderCompletion/${paymentMethod}`,{
    method : "POST",
    headers : {
      "Content-type" : "application/json"
    },
    body : JSON.stringify({
      productId : productId,
      address : address
    })
  })
  res.then((response)=>{
    return response.json();
  })
  .then((data)=>{
     if(data.result == "success"){
      window.location.href = "/user/orderSuccess";
     }
  })
}

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

  function initiateCodPayment(address){
    console.log('helloooo')
    let cartProductIds = [];
    for(let product of productIds){
      cartProductIds.push(product.getAttribute('data-product-id'));
    }
    const res = fetch(`/view/buy/proceedToCodPayment`,{
      method : "POST",
      headers : {
        "Content-type" : "application/json"
      },
      body : JSON.stringify({
          productId : cartProductIds
      })
    })
    res.then((response)=>{
      return response.json(); 
    }).then((data)=>{
       createOrder(data.paymentMethod,data.result,address);
    })
}  

checkOutBtn.addEventListener('click', function(){
  if(address.checked === false){
    addressWarning.classList.remove('d-none');
    addressWarningText.classList.remove('d-none');
  }else{
    addressWarningText.classList.add('d-none');
  }
})

cartPaymentBtn.addEventListener('click', submitForm);

address.addEventListener('click', function(){
  addressWarning.classList.add('d-none');
})

async function submitForm(event){
  let arr = [];
  const addressFormData = new FormData(addressForm);
  for(let a of addressFormData){
    arr.push(a);
  }
  const addressData = Object.fromEntries(arr);
  event.preventDefault();
  if(address.checked === true){
    let form = document.getElementById('paymentForm');
    let formData = new FormData(form);
    let paymentMethod = formData.get("paymentSelect");
    if(paymentMethod == 'COD'){
     initiateCodPayment(addressData);
    }else if(paymentMethod == 'UPI'){
     initiateUpiPayment();
    }else if(paymentMethod == 'Debit Card'){
     initiateDebitCard();
    }  
  }else{
    setTimeout(function(){
    addressWarningText.classList.remove("shaker");
    },300)
    addressWarningText.classList.add("shaker");
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

if(couponApplyBtn){
    couponApplyBtn.addEventListener('click', function(){
      const validateCode = fetch('/user/validateCoupon',{
        method : "POST",
        headers : {
          "Content-type" : "application/json"
        },
        body : JSON.stringify({
          data : couponInput.value
        })
      })
      validateCode.then((response)=>{
        return response.json();
      }).then((data)=>{
         if(data.result.validateStatus === true){
           var amount = subtotal.innerHTML.replace('₹','') - subtotal.innerHTML.replace('₹','') * data.result.value/100;
           couponValue.innerHTML = "₹"+subtotal.innerHTML.replace('₹','') * 30/100
           productsum.innerHTML = subtotal.innerHTML.replace('₹','') - subtotal.innerHTML.replace('₹','') * data.result.value/100;
         }
      })
    })
}



