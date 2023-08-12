/*eslint-disable*/
//LOGOUT FUNCTIONALITY
const logout = async ()=>{
  try{
    const res = await axios({
      method:"GET",
      url:"/api/v1/users/logout",
    })
    if(res.data.status==='success'){
        showAlert('success',"Successfully Logged Out !!")
            location.reload(true);
    }
  }catch(err){
    showAlert('error',err.response.data.message)
  }
}
document.addEventListener('DOMContentLoaded', () => {
document.getElementById('logout/btn').addEventListener('click',logout)
})