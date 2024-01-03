
export const isLoggedIn = (req,res,next)=>{
  if(req.isAuthenticated() || req.session.isLoggedIn == true){
    return next();
  }else{
    console.log('you are not authenticated');
    req.flash('error', 'You Must Loggin!');
    return res.redirect('/user_login');
  }
}

export const fetchisLoggedIn = (req,res,next)=>{
  if(req.isAuthenticated() || req.session.isLoggedIn == true){
    return next();
  }else{
    res.status(401).json({ error : 'Unauthorized'});
  }
}

export const isBlocked = (req,res,next) => {
  if(req.user){
    const user = req.user;
  if(user.isBlocked === true){
    res.send('you are blocked');
  }else{
    next();
  }
  }else{
    next();
  }
  
}



