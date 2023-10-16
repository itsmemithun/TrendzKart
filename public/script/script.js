const passwordinput = document.getElementById('password-input');
const passworderror = document.getElementById('password-d');
const registerForm = document.getElementById('form');
const pswrdConfirmation = document.getElementById('passwordConfirmation');
const emailinput = document.getElementById('emailaddress');

passwordPattern = /^[a-zA-Z1-9@-]{8,}$/i;
emailPattern = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;

passwordinput.addEventListener("input", function(event){
    const result = validatePass(passwordinput.value);
    if(result === false){
      passworderror.innerHTML = 'Invalid Password!'
    }else{
      passworderror.innerHTML = '';
    }   
});

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

function validatePass(value){
   const result = passwordPattern.test(value);
   if(result == true){
    return true;
   }else{
    return false;
   }
}