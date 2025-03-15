import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import {toast} from 'react-toastify';
import axios from 'axios';

const Login = () => {

    const navigate = useNavigate();

    const {backendUrl,
         setIsloggedin,
         getUserData
        } = useContext(AppContext)
    
    
    const [state, setState] = useState('Sign up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const onSubmitHandler = async (e) =>{
        try {
            e.preventDefault();

            //Need to send  a cookie also when creating account, send a cookie by using this below the code
            axios.defaults.withCredentials = true;

            if(state === "Sign up"){
              const { data } = await axios.post(backendUrl + '/api/auth/register', {name,email,password})


              if(data.success){
                setIsloggedin(true)
                getUserData();
                navigate('/')
              }else{
                toast.error(data.message)
              }


            }else{
                if(state === "Login"){
                    const { data } = await axios.post(backendUrl + '/api/auth/login', {email,password})
      
                    if(data.success){
                      setIsloggedin(true)
                      getUserData()
                      navigate('/')
                    }else{
                      toast.error(data.message)
                    }
                }

            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to bg-purple-400'>
        <img onClick={()=> navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:2-32  cursor-pointer'/>

        <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
            <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === "Sign up" ? "Create Account" : "Login"}</h2>
            <p className='text-center text-sm mb-3'>{state === "Sign up" ? "Create your account" : "Login to your account"}</p>

            <form onSubmit={onSubmitHandler}>

                {state === "Sign up" && <div className='mb-3 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    <img src={assets.person_icon} alt="" />
                    <input type="text"  placeholder='fullname' required className='bg-transparent outline-none'value={name} onChange={e => setName(e.target.value)}/>
                </div>} 
                
                

                <div className='mb-3 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    <img src={assets.mail_icon} alt="" />
                    <input type="email"  placeholder='Email id' required className='bg-transparent outline-none' value={email} onChange={ e => setEmail(e.target.value)}/>
                </div>

                <div className='mb-3 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    <img src={assets.lock_icon} alt="" />
                    <input type="password" placeholder='Password' required className='bg-transparent outline-none'value={password} onChange={e => setPassword(e.target.value)}/>
                </div>

                <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-400 cursor-pointer'>Forgot password?</p>

                <button className='mb-4 w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
            </form>

            {state === "Sign up"? (
                <p className='text-gray-400 text-center text-xs mt-4'>Already have an account? <span className='underline text-blue-400 cursor-pointer' onClick={()=> setState("Login")}> Login Here</span></p>
            ) : (
                <p className='text-gray-400 text-center text-xs mt-4'>Done have an account? <span className='underline text-blue-400 cursor-pointer' onClick={()=> setState("Sign up")}>  Sign up</span></p>
            )}

            


            
        </div>
       
    </div>
  )
}

export default Login