const productdecrementbtns = document.getElementsById("productcountdecrementbtn");
const productincrementbtns = document.getElementsById("productcountincrementbtn");
const productcount = document.getElementById("productcount");

let count = 1;
for(let productincrementbtn of productincrementbtns){
  productincrementbtn.addEventListener('click', function(){
    count++;
    productcount.value = count;
  })
}

for(let productdecrementbtn of productdecrementbtns){}
productdecrementbtn.addEventListener('click', function(){
  if(count>1){
    count--;
    productcount.value = count;
  }
})