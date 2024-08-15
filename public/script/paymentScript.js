const proceedToPayment = document.querySelector(".proceedToPayment");
const checkStatus = document.querySelector(".checkStatus");
const productIncrementBtn = document.querySelector('.productcountincrementbtn2');
const productDecrementBtn = document.querySelector('.productcountdecrementbtn2');
const couponApply = document.querySelector('.couponApply');
const totalAmount = document.querySelector('.totalAmount');
const subTotal = document.querySelector('.subTotal')
const defaultAddressSelect = document.getElementById('defalutAddressSelect');
const addressForm = document.querySelector('.addressForm');
const addressCheckbox1 = document.querySelector('.addressCheckbox1');
const addressCheckbox2 = document.querySelector('.addressCheckbox2');

addressCheckbox1.addEventListener('click', function(){
  addressCheckbox2.checked = false;
})

addressCheckbox2.addEventListener('click', function(){
  addressCheckbox1.checked = false;
})

proceedToPayment.addEventListener('click', submitForm);

productIncrementBtn.addEventListener('click', async function(){
  const productCount = document.querySelector('.productcount');
  const productId = productDecrementBtn.getAttribute('data_product_id');
  const price = await getPrice(productId);
  let count = parseInt(productCount.value) || 1;
  count++;
  productCount.value = count;
  totalAmount.innerHTML = price*productCount.value;
  subTotal.innerHTML = price*productCount.value;
})

productDecrementBtn.addEventListener('click', async function(){
  const productCount = document.querySelector('.productcount');
  let count = productCount.value;
  if(count>1){
    count--;
    productCount.value = count;
    const productId = productDecrementBtn.getAttribute('data_product_id');
    const price = await getPrice(productId);
    totalAmount.innerHTML = totalAmount.innerHTML - price;
  }
})

couponApply.addEventListener('click', function(){

  const couponValue = document.querySelector('.couponValue');

})

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

function initiateCodPayment(address){
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
      console.log(data);
      createOrder(data.paymentMethod,data.result,address);
    })
}

function initiateDebitCard(){
  console.log('debit card payment');
}


if(addressCheckbox1.checked == true){
  const nameInput = document.querySelector('.nameInputTag');
  if(nameInput.value == ''){
    console.log('input tag is empty')
  }
}

async function submitForm(event){
  let address;
  event.preventDefault();
    if(addressCheckbox1.checked == true){
      let arr = [];
      let addressFormData = new FormData(addressForm);
      for(let p of addressFormData){
          arr.push(p);
      }
      address = Object.fromEntries(arr);
    }else if(defaultAddressSelect.checked == true){
      let arr = [];
      const defaultAddressForm = document.querySelector('.defaultAddressForm');
      let formData = new FormData(defaultAddressForm);
      for(let data of formData){
        arr.push(data);
      }
      address = Object.fromEntries(arr);
    }else{
      alert('Please select an address');
    }
   let form = document.getElementById('paymentForm');
   let formData = new FormData(form);
   let paymentMethod = formData.get("paymentSelect");
   if(paymentMethod == 'COD' && address){
    initiateCodPayment(address);
   }else if(paymentMethod == 'UPI'){
    initiateUpiPayment();
   }else if(paymentMethod == 'Debit Card'){
    initiateDebitCard();
   }
}

