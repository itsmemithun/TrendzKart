const savebtn = document.querySelector('.save-btn');
// form classes
const addressname = document.querySelector('.formAddressName');
const addressPhone = document.querySelector('.formAddressPhone');
const address = document.querySelector('.formAddress');
const addressDistrict = document.querySelector('.formAddressDistrict');
const addressPincode = document.querySelector('.formAddressPincode');
const addressRadio = document.getElementsByClassName("addressRadioInput");

// div classes
const nameDiv = document.querySelector('.showName');
const addressDiv = document.querySelector('.showAddress');
const districtDiv = document.querySelector('.showDistrict');
const phoneDiv = document.querySelector('.showPhone');
const pincodeDiv = document.querySelector('.showPincode');

// buttons
const addDltBtn = document.querySelectorAll('.addressDltBtn');
const doneButton = document.querySelector('.addressDoneBtn');
doneButton.addEventListener('click', addressSelector);

// variable declaration
let initialSelectedData;
let currentData;

if(savebtn){
  savebtn.addEventListener('click', function(){
    nameDiv.innerText = addressname.value;
    addressDiv.innerText = address.value;
    districtDiv.innerText = addressDistrict.value;
    phoneDiv.innerText = addressPhone.value;
    pincodeDiv.innerText = addressPincode.value;
  })
}

for(let e of addressRadio){
     e.addEventListener("change", (event)=>{
       currentData = event.target.getAttribute('addressid');
     })
}

for(let e of addDltBtn){
     e.addEventListener("click", deleteAddress);
}

function deleteAddress(event){
  let addressId = event.target.getAttribute('addressId');
  const res = fetch('/user/user_account/delete_address', {
       method : 'POST',
       headers : {
        "Content-type" : "application/json"
       },
       body : JSON.stringify({
        addressId : addressId
       })
   })
   res.then((response)=>{
    return response.json();
   })
   .then((data)=>{
     if(data.result.modifiedCount === 1){
        event.target.closest(".address-box").remove();
     }
     console.log(data.result.modifiedCount);
   })
}

function addressSelector(event){
  const res = fetch('/user/user_account/selectAddress', {
    method : 'POST',
    headers : {
      "Content-type" : "application/json"
    },
    body : JSON.stringify({
      initialSelectedData : initialSelectedData,
      currentData : currentData
    })
  })
  res.then((response)=>{
      return response.json();
  })
  .then((data)=>{
     window.location.href = '/user/user_account';
  })
}

function storeData(){
  initialSelectedData = getSelected();
}

function getSelected(){
  for(let data of addressRadio){
    if(data.checked){
      return data.getAttribute("addressid");
    }
  }
}