const productdecrementbtns = document.querySelectorAll(".productcountdecrementbtn");
const productincrementbtns = document.querySelectorAll(".productcountincrementbtn");
const productcounts = document.querySelectorAll(".productcount");
const productsum = document.querySelector(".product-sum");



for(let productincrementbtn of productincrementbtns ){
    productincrementbtn.addEventListener('click', function(){
     const btnGrp = this.closest(".btn-group");
     const productcount = btnGrp.querySelector(".productcount");
     let count = parseInt(productcount.value) || 1;
     count++;
     productcount.value = count;
     const cardBodyGrp = this.closest('.card-body-grp');
     const productPrize = cardBodyGrp.querySelector(".cart-product-price");
     let resultaftercalculation = parseInt(productPrize.innerHTML.replace("Price : ", "")) + parseInt(productsum.innerHTML.replace("₹", ""));
     console.log(resultaftercalculation);
     console.log(productPrize.innerHTML);
     console.log(productsum.innerHTML);
    })
}

for(let productdecrementbtn of productdecrementbtns){
  productdecrementbtn.addEventListener('click', function(){
    const btnGrp = this.closest(".btn-group");
    const productcount = btnGrp.querySelector(".productcount");
    let count = productcount.value;  
  if(count>1){
    count--;
    productcount.value = count;
  }
  })
}