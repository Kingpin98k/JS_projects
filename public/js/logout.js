/*eslint-disable*/
//LOGOUT FUNCTIONALITY
const logout = async ()=>{
  try{
    const res = await axios({
      method:"GET",
      url:"http://127.0.0.1:9999/api/v1/users/logout",
    })
    if(res.data.status==='success'){
        showAlert('success',"Successfully Logged Out !!")
        window.setTimeout(()=>{
            location.reload(true);
        },1000)
    }
  }catch(err){
    showAlert('error',err.response.data.message)
  }
}
document.addEventListener('DOMContentLoaded', () => {
document.getElementById('logout/btn').addEventListener('click',logout)
})