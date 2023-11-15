const productdecrementbtns = document.querySelectorAll(".productcountdecrementbtn");
const productincrementbtns = document.querySelectorAll(".productcountincrementbtn");
const productcounts = document.querySelectorAll(".productcount");
const productsum = document.querySelector(".product-sum");


// Product Quantity Increase Button //
for(let productincrementbtn of productincrementbtns ){
    productincrementbtn.addEventListener('click', function(){
     const btnGrp = this.closest(".btn-group");
     const productcount = btnGrp.querySelector(".productcount");
     let count = parseInt(productcount.value) || 1;
     count++;
     productcount.value = count;
     const productbodygrp = this.closest(".card-body-grp");
     const productid = productbodygrp.querySelector(".product-name").getAttribute("data-product-id");
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
      productsum.innerHTML = `₹${parseInt(productsum.innerHTML.replace("₹", "")) + parseInt(data.result)}`;
     })
    })
}

// Product Quantity Decrease Button //
for(let productdecrementbtn of productdecrementbtns){
  productdecrementbtn.addEventListener('click', function(){
    const btnGrp = this.closest(".btn-group");
    const productcount = btnGrp.querySelector(".productcount");
    let count = productcount.value;  
  if(count>1){
    count--;
    productcount.value = count;
    const productbodygrp = this.closest(".card-body-grp");
    const productid = productbodygrp.querySelector(".product-name").getAttribute("data-product-id");
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