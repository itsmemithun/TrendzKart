const container = document.querySelector(".imgMagnifierContainer");
const lens = document.querySelector(".lens");
const result = document.querySelector(".result");
const image = document.querySelector(".image");
const additionalImages = document.querySelectorAll(".extraProductImage");
const addToCartBtn = document.querySelector('.addToCartBtn');
const alertData = document.querySelector('.alert-data');
const cartAlert = document.querySelector('.cart-alert');
const containerRect = container.getBoundingClientRect();
const imageRect = image.getBoundingClientRect();
const lensRect = lens.getBoundingClientRect();
const resultRect = result.getBoundingClientRect();


// imports 
// import uniqid from 'uniqid';
// const uniqid = require('uniqid');
 

// EventListeners 

container.addEventListener('mouseenter', showLens);
container.addEventListener('mouseleave', hideLens);
container.addEventListener('mousemove', zoomImage);

for(let e of additionalImages){
    e.addEventListener('click', (event) => {addImage(event)});
}

addToCartBtn.addEventListener('click', addToCart);


lens.style.display =  'none';
result.style.display = 'none';

function showLens(){
  lens.style.display = `block`;
  result.style.display = 'inline';
} 

function hideLens(){

  lens.style.display = `none`
  result.style.display = 'none';
  
}

function zoomImage(e){

  const {x,y} = getMousePos(e);

  lens.style.left = x + "px";
  lens.style.top = y + "px";
  
  let fx = resultRect.width / lensRect.width;
  let fy = resultRect.height / lensRect.height;

  result.style.backgroundImage = `url(${image.src})`

  result.style.backgroundSize = `${imageRect.width * fx}px ${imageRect.height * fy}px`
  
  result.style.backgroundPosition = `-${x * fx}px -${y * fy}px`
 
}

function getMousePos(e){
  let x = e.clientX - containerRect.left - lensRect.width /2;
  let y = e.clientY - containerRect.top - lensRect.height /2;
  
  let minX = 0;
  let minY = 0;
  let maxX = containerRect.width - lensRect.width;
  let maxY = containerRect.height - lensRect.height;

  if(x <= minX){
    x = minX
  } else if(x >= maxX){
    x = maxX
  }

  if(y <= minY){
    y = minY
  } else if(y >= maxY){
    y = maxY
  }

return {x,y}
}

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

