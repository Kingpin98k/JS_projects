/*eslint-disable*/
const signup = async (name,email,password,confirmPassword)=>{
    try{
      const res = await axios({
        method:"POST",
        url:"http://127.0.0.1:9999/api/v1/users/signup",
        data:{
          name:name,
          email:email,
          password:password,
          confirmPassword:confirmPassword
        }
      })
      if(res.data.status==="Created Successfully"){
        showAlert('success',"Account Created Successfully !!")
        window.setTimeout(()=>{
         location.assign('/')
        },1500)
      }
    }catch(err){
      showAlert('error',err.response.data.message)
    }
}
document.addEventListener('DOMContentLoaded', () => {
document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault()

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    signup(name,email,password,confirmPassword)
  })
})