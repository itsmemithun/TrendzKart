const emailinput = document.getElementById('emailInput');
const validationmsg = document.getElementById('emailvalidationmsg');
const usereditForm = document.getElementById('userEditForm');
const productDltButtons = document.getElementsByClassName('product-dltbtn');
const userNameInput = document.querySelector('.userNameInput');
const userSearchForm = document.querySelector('.userSearchForm');
const usernavs = document.getElementsByClassName('user-nav');
const fileInput = document.getElementById("productimage");
const imageContainer = document.getElementById("images");
const numOfFiles = document.getElementById("num-of-files");
const productEditImgInputTag = document.querySelector('.productEditImgInputTag');
const bannerInput1 = document.querySelector('#banner_input1');
const bannerInput2 = document.querySelector('#banner_input2');
const bannerInput3 = document.querySelector('#banner_input3');
const bannerInput4 = document.querySelector('#banner_input4');
const bannerSubmitButton1 = document.querySelector('.bannerSubmitButton1');
const bannerSubmitButton2 = document.querySelector('.bannerSubmitButton2');
const bannerSubmitButton3 = document.querySelector('.bannerSubmitButton3');
const bannerSubmitButton4 = document.querySelector('.bannerSubmitButton4');
const productImgDltBtn = document.querySelectorAll('.productImgDltBtn');
const returnApproveBtn = document.querySelector('.returnApproveButton');
const cancelApproveBtn = document.querySelector('.cancelApproveButton');
const returnSection = document.querySelector('.returnSection');


const emailPattern = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/

if(bannerInput1){
  bannerInput1.addEventListener('change', function(){
  bannerSubmitButton1.style.display = 'block';
});
}

if(bannerInput2){
  bannerInput2.addEventListener('change', function(){
  bannerSubmitButton2.style.display = 'block';
  });
}

if(bannerInput3){
  bannerInput3.addEventListener('change', function(){
  bannerSubmitButton3.style.display = 'block';
  });
}


if(bannerInput4){
  bannerInput4.addEventListener('change', function(){
  bannerSubmitButton4.style.display  = 'block';
  })
}

if(emailinput){
  emailinput.addEventListener("input", function(event){
    const result = emailPattern.test(emailinput.value);
    if(!result){
      validationmsg.innerHTML = 'Invalid Email Address'
    }else{
      validationmsg.innerText = '';
    }
  })
}

if(usereditForm){
  usereditForm.addEventListener("submit", function(event){
    const result = emailPattern.test(emailinput.value);
    if(!result){
      alert('Invalid Email address');
      event.preventDefault();
    }
  })
}


if(productDltButtons){
  for(let deleteBtn of productDltButtons){
    deleteBtn.addEventListener("click", function(e){
    e.preventDefault();
    const productid = deleteBtn.getAttribute('data-productid');
    const reqpath = deleteBtn.getAttribute('href');
    const res = fetch(reqpath, {
      method : "DELETE",
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
      const product = this.closest(".product-details");
      product.remove();
      alert(data.result);
    })
   })
  }
}


if(userSearchForm){
  userSearchForm.addEventListener('submit', async function(e){
   e.preventDefault();
   const usernavsArray = Array.from(usernavs);
   for(let i=0; i<usernavsArray.length; i++){
       usernavsArray[i].remove();
   }
   const inputValue = userNameInput.value;
   const res = fetch('/admin/panel/user_search',{
     method : 'POST',
     headers : {
      "Content-type" : "application/json"
     },
     body : JSON.stringify({
       searchValue : inputValue
     })
   })
   res.then((response)=>{
   return response.json();
   })
   .then((data)=>{
    const userSearchContainer = document.querySelector('.user-searchContainer');
    data.result.forEach((data)=>{
      const result = document.createElement('div');
      result.innerHTML = `
      <nav class="navbar mt-1 user-nav rounded">
      <div class="container">
        <div class="">
          <img class="img-thumbnail" src="https://cdn-icons-png.flaticon.com/512/5511/5511365.png" alt="Bootstrap" width="30" height="24">
          <span class="user_name"> ${data.username} </span>
        </div>
        <div>
          <p class="pe-5 user_email"> ${data.email} </p>
        </div>
        <div>
          <a href="/admin/panel/user_management/delete_user/${data._id}"><button type="button" class="btn btn-danger user_delete_btn">Delete</button></a>
          <a href="/admin/panel/user_management/edit_user/${data.id}"><button type="button" class="btn btn-primary user_edit_btn">Edit</button></a>
        </div>
      </div>
    </nav>`
    userSearchContainer.appendChild(result);
    })
   })
  })
}


function preview(){
   numOfFiles.textContent = `${fileInput.files.length} New Files Selected`;
   for(i of fileInput.files){
    const reader = new FileReader(); 
    const figure = document.createElement("figure");
    const figCap = document.createElement("figcaption");
    figCap.innerText = i.name;
    figure.appendChild(figCap);
    reader.onload = ()=>{
      let img = document.createElement("img");
      img.setAttribute("src", reader.result);
      img.classList.add("preview-img");
      figure.insertBefore(img,figCap);
    }
    imageContainer.appendChild(figure);
    reader.readAsDataURL(i);
   }
}

if(productEditImgInputTag){
   const data = productEditImgInputTag.getAttribute("data");
   const res = fetch('/admin/panel/getFile',{
    method : "POST",
    headers : {
      "Content-type" : "application/json"
    },
    body : JSON.stringify({
       value : data
    })
   })
   res.then((response)=>{
   return response.json();
   })
   .then((data)=>{
    console.log(data);
   })
  }


  if(productImgDltBtn){
    const productId = document.querySelector('.productName').getAttribute('data-product-id');
     for(let dltBtn of productImgDltBtn){
        dltBtn.addEventListener("click",function(){
          const path = dltBtn.getAttribute('data-product');
          const res = fetch('/admin/panel/products/delete_image',{
            method : "DELETE",
            headers : {
              "Content-type" : 'application/json'
            },
            body : JSON.stringify({
              path : path,
              productId : productId
            })
          })
          res.then((response)=>{
            return response.json();
          })
          .then((data)=>{
            if(data.result === "success"){
              let imgData = this.closest('figure');
              imgData.remove();
            }else{
              console.log(data.result);
              console.log(data.error);
            }
          })
          .catch((err)=>{
            console.log(err);
          })
        })
     }
  }



  if(returnApproveBtn){
    returnApproveBtn.addEventListener('click', function(){
      const res = fetch('/admin/panel/orders/return_request/approve',{
        method : 'POST',
        headers : {
          "Content-type" : 'application/json',
        },
        body : JSON.stringify({
          orderId : this.getAttribute('data-attribute-orderId')
        })
      })
      res.then((response)=>{
        return response.json();
      }).then((data)=>{
        if(data.result == 'success'){
          returnSection.classList.add('d-none');
        }
      })
    })
  }


  if(cancelApproveBtn){
    cancelApproveBtn.addEventListener('click', function(){
      console.log(this.getAttribute('data-attribute-orderId'));
      const res = fetch('/admin/panel/orders/cancel_request/approve',{
        method : 'POST',
        headers : {
          "Content-type" : "application/json",
        },
        body : JSON.stringify({
          orderId : this.getAttribute('data-attribute-orderId')
        })
      })
      res.then((response)=>{
        response.json();
      })
      .then((data)=>{
        console.log(data);
      })
    })
  }










