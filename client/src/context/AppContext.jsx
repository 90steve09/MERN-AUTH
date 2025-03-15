import axios from "axios";
import { createContext, useState } from "react";
import { data } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext =  createContext();


export const AppContextProvider = (props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsloggedin] = useState(false);
    const [userData, setUserData] = useState(false);


    const getAuthState = async () =>{
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
            if(data.success){
               setIsloggedin(true);
               getUserData();
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserData = async () =>{
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data')
            console.log(data);
            
            data.success ? setUserData(data.userData) : toast.error(data.message)


        } catch (error) {
            toast.error(error.messages)
        }
    }


    const value = {
        backendUrl,
        isLoggedin, setIsloggedin,
        userData , setUserData,
        getUserData,
    }




    return (
        <AppContext.Provider value={value}>
                {props.children}
        </AppContext.Provider>
    )
        

    
}
