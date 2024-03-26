const proceedToPayment = document.querySelector(".proceedToPaymentBtn");
const price = document.querySelector('.endPrice').innerHTML;
proceedToPayment.addEventListener('click', initiatePayment);

console.log(price)

function initiatePayment(){
 
  const res = fetch('/view/buy/:id/proceedToPayment',{
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
