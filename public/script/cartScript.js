const productdecrementbtns = document.querySelectorAll(".productcountdecrementbtn");
const productincrementbtns = document.querySelectorAll(".productcountincrementbtn");
const productcounts = document.querySelectorAll(".productcount");


for(let productincrementbtn of productincrementbtns ){
    productincrementbtn.addEventListener('click', function(){
     const btnGrp = this.closest(".btn-group");
     const productcount = btnGrp.querySelector(".productcount");
     let count = parseInt(productcount.value) || 1;
     count++;
     productcount.value = count;
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