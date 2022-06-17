const router=require('express').Router()
const Todo_model=require('../models/todo')
const path = require('path')
const multer = require('multer')


const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!')
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

router.post('/add/todo', upload.single('image'),(req,res)=>{
    const {todo}=req.body;
    const {email_}=req.user.email;

    const image = (req.file===undefined) ? 'uploads/todo.jpg' : req.file.path
    
     /* console.log(req.body)
     console.log(req.file) */


    const newTodo=new Todo_model({todo,email_:req.user.email,image:image,done:"0"})
    if(todo==""){
        res.redirect('/')
    }
    newTodo.save()
    .then(()=>{
        console.log("done")
        res.redirect('/')
    })
    .catch(err=>console.log(err))

})
.get("/delete/todo/:_id",(req,res)=>{
    const {_id}=req.params;
    Todo_model.deleteOne({_id})
    .then(()=>{
        console.log("deleted")
        res.redirect('/')
    })
    .catch((err)=>console.log(err));
})

.get("/update/todo/:_id",(req,res)=>{
    const {_id}=req.params;
    const info=Todo_model.find();
    console.log(info)
    Todo_model.updateOne({_id}, { done:"1"})
    .then(()=>{
        console.log("deleted")
        res.redirect('/')
    })
    .catch((err)=>console.log(err));
});

module.exports=router;