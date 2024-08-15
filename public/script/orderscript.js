const orderDetails = document.getElementsByClassName('orderDetails');
const returnRequestBtn = document.querySelector('.returnRequestBtn');

returnRequestBtn.addEventListener('click', funtion)

C:\Program Files\WindowsApps\Microsoft.VCLibs.140.00.UWPDesktop_14.0.33728.0_x64_8wekyb3d8bbwe\MSVCP140.dll is either not designed to run on Windows or it contain an error.Try installing the program using the orginal installation media or contact your system administration or the software vendor for support .Error status 0xc0000020 what is this error

for(let orderDetail of orderDetails){
  orderDetail.addEventListener('click',getOrderDetails)
}


function getOrderDetails(){
   const  orderId = this.getAttribute('data_orderId');
   const res = fetch('/user/getorderdetails',{
     method : "POST",
     headers : {
        "Content-type" : "application/json"
     },
     body : JSON.stringify({
         orderId : orderId
     })
   })
   res.then((response)=>{
    return response.json();
   })
   .then((data)=>{
    console.log(data.result[0]); 
    document.querySelector('.orderId').textContent = data.result[0].orderId;
    document.querySelector('.orderAmount').textContent = data.result[0].orderAmount;
    document.querySelector('.paymentMethod').textContent = data.result[0].paymentMethod;
    document.querySelector('.orderStatus').textContent = data.result[0].status;
    document.querySelector('.paymentStatus').textContent = data.result[0].paymentStatus;
    document.querySelector('.orderPlacedOn').textContent = data.result[0].dateOfOrderPlaced;
   })
}