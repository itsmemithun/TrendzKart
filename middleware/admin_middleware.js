import multer from 'multer';
import {unlink} from 'fs/promises';

export const isAdmin = (req,res,next) => {
  if(req.session.isAdmin === true){
    next();
  }else{
    res.status(401).redirect('/admin');
  }
}

export const uploadProductimage = multer({
    storage : multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './public/asset/product_images')
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname)
      }
    })      
})

export const uploadBannerImage = multer({
  storage : multer.diskStorage({
    destination : function(req,file,cb){
      cb(null, './public/asset/banners')
    },
    filename : function (req,file,cb){
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  })
})


export const deleteImage = async function delteImage(path){
  try{
    await unlink(path)
    return { success : true}
  }catch(err){
    console.log('failed to delete the file');
    return {error : err.message};
  }
}

