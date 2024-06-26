const password1 = document.getElementById('passwordInput');
const password2 = document.getElementById('confirmPasswordInput');
const form  = document.getElementById('newCredentialForm');
const warnText = document.getElementById('warningText');

form.addEventListener('submit',function(event){
    console.log(password1.value,password2.value);
   if(password1.value === password2.value){
       this.submit();
   }else{
       event.preventDefault();
       warnText.classList.remove('d-none');
   }

  })