/*eslint-disable*/
const bookThistour = async (tour_btn,tour_id)=>{
  try{
    const res = await axios({
        method:"POST",
        url:`/api/v1/users/${tour_id}/my-bookings`
       })
       if(res.data.status==="Successful"){
        showAlert('success',"Tour Added Successfully !")
      }
  }catch(err){
    if(err.response.data.message.startsWith('Duplicate')){
      showAlert('error','Tour Already Booked !!')
    }else{
      showAlert('error',err.response.data.message)
    }
  }
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("book-tour-button").addEventListener("click",()=>{
    const tour_btn = document.getElementById("book-tour-button")
    const tour_id_arr = window.location.href.split('/')
    const tour_id = window.location.href.split('/')[tour_id_arr.length-1]
    bookThistour(tour_btn,tour_id)
  })
})