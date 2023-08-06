/*eslint-disable*/




//----------------------------------------------------------------------------------------
//Alert functionality Adding

//Hiding alert
const hideAlert = ()=>{
  const el = document.querySelector('.alert')
  if(el) el.parentElement.removeChild(el)
}

const showAlert = (type,msg)=>{
  hideAlert()  //If there is already an alert then hide it
  const markup = `<div class="alert alert--${type}">${msg}</div>`
  document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
  window.setTimeout(hideAlert,5000)
}

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
    if(res.data.status==='Created Succcessfully'){
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

document.querySelector('.form').addEventListener('submit',e=>{
    e.preventDefault();
    const email =document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email,password)
})