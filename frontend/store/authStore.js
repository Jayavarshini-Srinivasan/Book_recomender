import {create} from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_URL} from "../constants/api";

export const useAuthStore = create((set)=>({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`https://bookworm-sou5.onrender.com/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ token: data.token, user: data.user, isLoading: false });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
    

    login: async(email,password)=>{
        set({isLoading:true});
        try{
            const response = await fetch(`${API_URL}/api/auth/login`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if(!response.ok) throw new Error(data.message || "Something went wrong");

            await AsyncStorage.setItem("user",JSON.stringify(data.user));
            await AsyncStorage.setItem("token",JSON.stringify(data.token));

            set({token:data.token , user:data.user, isLoading:false});

            return ({success:true});

        }catch(err){
            set({isLoading:false});
            return({success:false,error:err.message});
        }
    }
}));