const container = document.querySelector(".imgMagnifierContainer");
const lens = document.querySelector(".lens");
const result = document.querySelector(".result");
const image = document.querySelector(".image");

const containerRect = container.getBoundingClientRect();
const imageRect = image.getBoundingClientRect();
const lensRect = lens.getBoundingClientRect();
const resultRect = result.getBoundingClientRect();


container.addEventListener('mouseenter', showLens);
container.addEventListener('mouseleave', hideLens);
container.addEventListener('mousemove', zoomImage);

lens.style.display =  'none';
result.style.display = 'none';

function showLens(){
  console.log('mouse entered')
  lens.style.display = `block`;
  result.style.display = 'inline';
  console.log(lens.style.display);

} 

function hideLens(){
  console.log('mouse left the container')
  lens.style.display = `none`
  result.style.display = 'none';
  console.log(lens.style.display);
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