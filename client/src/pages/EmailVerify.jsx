import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const EmailVerify = () => {

  axios.defaults.withCredentials = true
  const navigate = useNavigate()
  const {backendUrl, isLoggedin, userData, getUserData} = useContext(AppContext)
 
  //use for auto focus on inputfield
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

  //
  const onSubmithandler  = async (e) =>{
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join("");

      const {data} = await axios.post(backendUrl + "/api/auth/verify-account",{otp})

      if(data.success){
        toast.success(data.message)
        getUserData()
        navigate("/")
      }
      else{
        toast.error(data.message)
      }

      
    } catch (e) {
      toast.error(e.message)
    }
  }


  useEffect(() =>{
    isLoggedin && userData && userData.isAccountVefified && navigate('/')
  }, [isLoggedin, userData])


  return (
    <div  className='flex items-center justify-center min-h-screen  bg-gradient-to-br from-blue-200 to bg-purple-400'>

      <img onClick={()=> navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:2-32  cursor-pointer'/>

      <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onSubmithandler}>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
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

        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Verify email</button>
      </form>

    </div>
  )
}

export default EmailVerify