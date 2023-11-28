const categoryButtons = document.getElementsByClassName('category-edit-btn');
const modalInput = document.querySelector('.modal-input');
const categoryForm = document.querySelector('.categoryForm');


for(let categoryBtn of categoryButtons){
  categoryBtn.addEventListener('click', function(e){
    e.preventDefault();
    const href = categoryBtn.getAttribute("data-category-path");
    const productId = href.replace("/admin/panel/category/edit/", "");
    const res = fetch(href, {
     method : "POST",
     headers : {
        "Content-type" : "application/json"
     },
     body : JSON.stringify({
       productid : productId
     })
    })
    res.then((response)=>{
      return response.json();
    })
    .then((data)=>{
      console.log(data);
      console.log(categoryForm);
      modalInput.value = data.result.category;
      categoryForm.setAttribute("action", `/admin/panel/category/update/${productId}`);
    })
  })
}