// const User=require("../../models/User")




const section=document.querySelector('.section')



section.addEventListener('click',(e)=>{
    if(e.target.nodeName==='I')
      e.target.classList.toggle('turnRed');
     
    }
)