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
  