console.log('helloo');
const emailinput = document.getElementById('emailInput');
const validationmsg = document.getElementById('emailvalidationmsg');
const usereditForm = document.getElementById('userEditForm');

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