const container = document.querySelector(".imgMagnifierContainer");
const zoomImage = document.querySelector(".zoomImage");
const image = document.querySelector(".image");
const additionalImages = document.querySelectorAll(".extraProductImage");
const addToCartBtn = document.querySelector('.addToCartBtn');
const alertData = document.querySelector('.alert-data');
const cartAlert = document.querySelector('.cart-alert');

// imports 
// import uniqid from 'uniqid';
// const uniqid = require('uniqid');

// container.addEventListener('mouseenter', ()=>{
//   zoomImage.style.backgroundImage = `url(${image.src})`;
// })

container.addEventListener('mousemove', (event)=>{
  zoomImage.style.display =  'block';
  zoomImage.style.backgroundImage = `url(${image.src})`;
    x = (event.offsetX * 100) / image.offsetWidth,
    y = (event.offsetY * 100) / image.offsetHeight
  zoomImage.style.backgroundPosition = `${x}% ${y}%` ;
})

container.addEventListener('mouseleave', (event)=>{
  zoomImage.style.display = "none";
})


// EventListeners 

for(let e of additionalImages){
    e.addEventListener('click', (event) => {addImage(event)});
}

addToCartBtn.addEventListener('click', addToCart);



function addImage(event){
   image.src = event.target.src;
}


function addToCart(){
   const productid = addToCartBtn.getAttribute('productId');
   console.log(productid);
   const res = fetch(`/user/cart/add/${productid}`, {
     method : "POST",
     headers : {
      "Content-type" : "application/json"
     },
     body : JSON.stringify({
      productid : productid
    })
   })
   res.then((response)=>{
    return response.json();
   })
   .then((data)=>{
    console.log(data);
    alertData.innerHTML = data.result;
    cartAlert.classList.remove('display-none');
    cartAlert.classList.add('alert-on-active');
    setTimeout(()=>{
    cartAlert.classList.remove('alert-on-active');
    cartAlert.classList.add('display-none');
    },1500) 
  })
}

