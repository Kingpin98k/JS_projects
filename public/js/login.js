/*eslint-disable*/
//------------------------------------------------------------------------------------
//LOGIN FUCTIONALITY
const login = async (email,password)=>{
   try{
    const res = await axios({
        method:"POST",
        url:"http://127.0.0.1:9999/api/v1/users/login",
        data:{
            email:email,
            password:password
        }
    })
    if(res.data.status==='Created Successfully'){
      showAlert('success','Logged In Successfully')   //either 'success' or 'error'
      window.setTimeout(()=> {
        location.assign('/')
      },1500)
    }
   }catch(err){
    showAlert('error',err.response.data.message)
   }
}

//------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
document.getElementById('login-form').addEventListener('submit',e=>{
    e.preventDefault();
    const email =document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email,password)
})
})