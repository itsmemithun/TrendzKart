export const isAdmin = (req,res,next) => {
  if(req.session.isAdmin === true){
    next();
  }else{
    res.status(401).send('you are not authenticted!');
  }
}