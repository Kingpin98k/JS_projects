/*eslint-disable*/
//This is wherer we will handle all the functionalities related to updating user settings via account page
const updateUserPassword = async (currentP,newP,confirmP)=>{
    try{
        const res = await axios({
            method:"PATCH",
            url:"http://127.0.0.1:9999/api/v1/users/updatePassword",
            data:{
                currentPassword:currentP,
                newPassword:newP,
                newPasswordConfirm:confirmP
            }
        })
        if(res.data.status==="Created Successfully"){
            showAlert('success',"Info Updated")
        }
    }catch(err){
        showAlert('error',err.response.data.message)
    } 
}

const updateUserInfo = async (name,email)=>{
  try{
    const res = await axios({
        method:"PATCH",
        url:"http://127.0.0.1:9999/api/v1/users/updateMe",
        data:{
            name,
            email
        }
      })
      if(res.data.status==="Successfully Updated"){
        showAlert('success',"Info Updated")
      }
  }catch(err){
    showAlert('error',err.response.data.message)
  }
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('user-info-update-form').addEventListener('submit',e=>{
        e.preventDefault();
        const name =document.getElementById('name').value
        const email = document.getElementById('email').value
        updateUserInfo(name,email)
    })
})

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('user-password-update-form').addEventListener('submit',e=>{
        e.preventDefault();
        const password_current = document.getElementById('password-current').value
        const password = document.getElementById('password').value
        const password_confirm = document.getElementById('password-confirm').value
        updateUserPassword(password_current,password,password_confirm)
    })
})
