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
  

//LOGOUT FUNCTIONALITY

const logout = async ()=>{
  try{
    await axios({
      method:"GET",
      url:"http://127.0.0.1:9999/api/v1/users/logout",
    })
    showAlert('success',"Logged Out Successfully !!")
    window.setTimeout(()=>{
    location.assign('/')
    },1000)
  }catch(err){
    showAlert('error',err.response.data.message)
  }
}

document.querySelector('.nav__el--logout').addEventListener('click',logout)