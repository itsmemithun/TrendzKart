console.log('hello');
const passwordinput = document.getElementById('password-input');
const passworderror = document.getElementById('password-d');
const registerForm = document.getElementById('form');
const pswrdConfirmation = document.getElementById('passwordConfirmation');
const emailinput = document.getElementById('emailaddress');
const usereditform = document.getElementById('usereditform');
const useremailinput = document.getElementById('useremailinput');
const useremailmsg = document.getElementById('useremailmsg');
const addtowishlist = document.querySelectorAll('.addtowish-btn');
const wishlistalert = document.querySelector('.wishlist-alert');
const alertdata = document.querySelector('.alert-data');
const addtocart = document.querySelectorAll('.addtocart');
const cartalert = document.querySelector('.cart-alert');

passwordPattern = /^[a-zA-Z1-9@-]{8,}$/i;
emailPattern = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;

function validatePass(value){
  const result = passwordPattern.test(value);
  if(result == true){
   return true;
  }else{
   return false;
  }
}

if(passwordinput){
  passwordinput.addEventListener("input", function(event){
    const result = validatePass(passwordinput.value);
    if(result === false){
      passworderror.innerHTML = 'Invalid Password!'
    }else{
      passworderror.innerHTML = '';
    }   
});
}

if(registerForm){
  registerForm.addEventListener("submit", function(event){
    if(!passwordPattern.test(passwordinput.value)){
       passworderror.innerHTML = "Invalid password!";
       console.log('try again');
       event.preventDefault();
    }
    if(pswrdConfirmation.value !== passwordinput.value){
      alert('password missmatch');
      event.preventDefault();
    }
    if(!emailPattern.test(emailinput.value)){
      event.preventDefault();
      alert('Invalid Email!');
    }
  })
}

if(useremailinput){
  useremailinput.addEventListener("input", function(event){
    console.log('button clicked');
    if(!emailPattern.test(useremailinput.value)){
     useremailmsg.innerHTML = "Invalid Email";
    }else{
     useremailmsg.innerHTML = ""; 
    }
  })
}

if(usereditform){
  usereditform.addEventListener("submit", function(event){
    if(!emailPattern.test(useremailinput.value)){
      event.preventDefault();
      alert('Invalid Email');
    }
  })
} 

if(addtowishlist){
  for(let btn of addtowishlist){
    btn.addEventListener("click", function(event){
      event.preventDefault();
      btn.classList.forEach((data)=>{
        // Adding product to wishlist 
       if(data == "bi-suit-heart"){
         // Adding bootstrap classes for styling
         btn.classList.remove("bi-suit-heart");
         btn.classList.add("bi-suit-heart-fill","text-danger");
         // Sending fetch request
         const href = btn.getAttribute('href');
         let productid = href.replace('user/wishlist/add/','');                                                                                                                                                                                                             
         const res = fetch(href,{
             method : "POST",
             headers : {
                 "Content-type" : "application/json"
             },
             body : JSON.stringify({
               productid : productid
             })
         })
         res.then((response)=>{
          if(response.ok){
            res.then((response) =>{
              return response.json();
            }).then((data)=>{
              alertdata.innerHTML = data.result;
              wishlistalert.classList.remove("display-none")
              wishlistalert.classList.add("alert-on-active");
              setTimeout(()=>{
              wishlistalert.classList.add("display-none");
              wishlistalert.classList.remove("alert-on-active");
              },1500);
            }).catch((error) => {
              console.log("Error :"+error);
            })
           }else if(response.status === 401){
             window.location.href = "/user_login";
           }    
         })                
      }
      else if(data == "bi-suit-heart-fill"){
         btn.classList.remove("bi-suit-heart-fill", "text-danger");
         btn.classList.add("bi-suit-heart");
         let href = btn.getAttribute('href');
         let href2 = href.replace('add', 'remove');
         let productid = href.replace('user/wishlist/add/','');                                                                                                                                                                                                             
         const res = fetch(href2,{
             method : "POST",
             headers : {
                 "Content-type" : "application/json"
             },
             body : JSON.stringify({
               productid : productid
             })
         })
            res.then((response) =>{
               return response.json();
            }).then((data)=>{
              alertdata.innerHTML = data.result;
              wishlistalert.classList.remove("display-none")
              wishlistalert.classList.add("alert-on-active");
              setTimeout(()=>{
              wishlistalert.classList.add("display-none");
              wishlistalert.classList.remove("alert-on-active");
              },1500);            
            }).catch((error) => {
               console.log("Error :"+error);
            })  
        }
      })
    });
  }
}

if(addtocart){
  for(let cart of addtocart){
    cart.addEventListener("click", function(e){
      e.preventDefault();
      let href = cart.getAttribute('href');
      let productid = href.replace('/user/cart/add/', '');
      console.log(productid);
      const res = fetch(href, {
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
      }).then((data)=>{
        console.log(data);
        alertdata.innerHTML = data.result;
        cartalert.classList.remove('display-none');
        cartalert.classList.add('alert-on-active');
        setTimeout(()=>{
        cartalert.classList.remove('alert-on-active');
        cartalert.classList.add('display-none');
        },1500) 
      })
    })
  }
}



