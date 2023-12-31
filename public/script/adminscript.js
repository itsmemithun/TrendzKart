const emailinput = document.getElementById('emailInput');
const validationmsg = document.getElementById('emailvalidationmsg');
const usereditForm = document.getElementById('userEditForm');
const productDltButtons = document.getElementsByClassName('product-dlt-btn');
const userNameInput = document.querySelector('.userNameInput');
const userSearchForm = document.querySelector('.userSearchForm');
const usernavs = document.getElementsByClassName('user-nav');

const fileInput = document.getElementById("productimage");
const imageContainer = document.getElementById("images");
const numOfFiles = document.getElementById("num-of-files");

console.log(fileInput);

const emailPattern = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/

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
      console.log(product);
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
   imageContainer.innerHTML = "";
   numOfFiles.textContent = `${fileInput.files.length}
   Files Selected`;

   for(i of fileInput.files){
    const reader = new FileReader();
    console.log(reader); 
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