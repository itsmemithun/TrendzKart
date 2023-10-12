
export const isLoggedIn = (req,res,next)=>{
  if(req.isAuthenticated() || req.session.isLoggedIn == true){
    return next();
  }else{
    console.log('you are not authenticated');
    return res.redirect('/user_login');
  }
}



