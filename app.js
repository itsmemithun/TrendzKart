import express from "express";

const app = express();


app.get('/',(req,res)=>{
  res.send('successfully connected');
})


const port = 3000

app.listen(port,(req,res) => {
  console.log(`server started on port ${port}`);
})