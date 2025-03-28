import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {


  const {backendUrl} = useContext(AppContext)
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState(0)
  const [isOtpSubmited, setIsOtpSubmited] = useState(false)




  const inputRefs = React.useRef([])
    const handleInput = (e, index)=>{
      if(e.target.value.length > 0 && index < inputRefs.current.length -1){
        inputRefs.current[index+1].focus()
      }
    }
    const handleKeyDown = (e, index) =>{
      if(e.key === 'Backspace' && e.target.value === "" && index > 0){
        inputRefs.current[index - 1].focus();
      }
    }
  
    //for ctrl-v copy paste
    const handlePaste = (e) =>{
      const paste = e.clipboardData.getData("text")
      const pasteArray = paste.split("");
      pasteArray.forEach((char, index) => {
        if(inputRefs.current[index]){
          inputRefs.current[index].value = char;
        }
        
      });
  
    }


    //for reset send email
    const onSubmitEmail = async (e) =>{
       e.preventDefault();
        try {
          const {data} =  await axios.post(backendUrl + "/api/auth/send-reset-otp", {email})
          data.success ? toast.success(data.message) : toast.error(data.message)
          data.success && setIsEmailSent(true);

          console.log(isEmailSent, "<==============");
          
        } catch (error) {
          toast.error(error.message)
        }
    }

    //for otp
    const onSubmitOTP =  async (e)=>{
      e.preventDefault();

        try { 
          const otpArray = inputRefs.current.map(e => e.value)
          setOtp(otpArray.join(""))
          setIsOtpSubmited(true);
          
        } catch (error) {
          toast.error(error.message)
        }
    }

    //submit password
    const onSubmitNewPassword = async () =>{
      e.preventDefault();
      try {
       const {data} =  await axios.post(backendUrl + '/api/auth/reset-password', {email, otp, newPassword})

       data.success ? toast.success(data.message) : toast.error(data.message)
       
       data.success && navigate('/login')
       
       
        
      } catch (error) {
        toast.error(error.message)
      } 
    }
  

  return (
    <div className='flex items-center justify-center min-h-screen  bg-gradient-to-br from-blue-200 to bg-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:2-32  cursor-pointer' />
     
     

      {/* ENTER EMAIL ID */}
      {!isEmailSent && 
        <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onSubmitEmail}>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset password</h1>
          <p className='text-center mb-6 text-indigo-300 rounded-sm'>Enter you registered email address</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input type="email" placeholder='Email id' className='w-full bg-transparent outline-none text-white'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            />
          </div>
          <button type='submit' className=' bg-gradient-to-br from-blue-200 to bg-purple-400 w-full p-2 rounded-full'>Submit</button>
        </form>
        }



      {/* OTP INPUT FORM */}
      {!isOtpSubmited && isEmailSent &&
        <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onSubmitOTP} >
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset password OTP</h1>
          <p className='text-center mb-6 bg-indigo-300'>Enter the 6-digit code sent to you email id</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) =>(
              <input type="text" maxLength= "1" key={index} required 
                className='w-12 h-12 border-b-2 focus:outline-none border-gray-400 bg-transparent  text-white text-center text-xl '
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}

              />
            ))}
          </div>

          <button type='submit' className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Submit</button>
        </form>
      }



      {/*Enter new password */}
      
      {isOtpSubmited && isEmailSent && 
        <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onSubmitNewPassword}>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New password</h1>
          <p className='text-center mb-6 text-indig o-300 rounded-sm'>Enter the new password below</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input type="password" placeholder='input password' className='w-full bg-transparent outline-none text-white'
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            />
          </div>
          <button type='submit' className=' bg-gradient-to-br from-blue-200 to bg-purple-400 w-full p-2 rounded-full'>Submit</button>
        </form>
      }

    </div>
  )
}

export default ResetPassword