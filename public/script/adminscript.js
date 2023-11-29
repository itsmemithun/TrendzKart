const emailinput = document.getElementById('emailInput');
const validationmsg = document.getElementById('emailvalidationmsg');
const usereditForm = document.getElementById('userEditForm');
const productDltButtons = document.getElementsByClassName('product-dlt-btn');
const userNameInput = document.querySelector('.userNameInput');
const userSearchForm = document.querySelector('.userSearchForm');
const usernavs = document.getElementsByClassName('user-nav');

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
   for(let i=0; i<usernavs.length; i++){
       console.log(usernavs[i]);
       usernavs[i].remove();
   }
  //  const inputValue = userNameInput.value;
  //  const res = fetch('/admin/panel/user_search',{
  //    method : 'POST',
  //    headers : {
  //     "Content-type" : "application/json"
  //    },
  //    body : JSON.stringify({
  //      searchValue : inputValue
  //    })
  //  })
  //  res.then((response)=>{
  //  return response.json();
  //  })
  //  .then((data)=>{

  //   console.log(data);
  //  })
  })
}