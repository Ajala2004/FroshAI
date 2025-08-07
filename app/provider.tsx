"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

export type UsersDetail = {
  name:string,
  email:string,
  creditd:number
}
interface ProviderProps {
  children: React.ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
  const { user } = useUser(); // Corrected destructuring
  const [UserDetail,setUserDetail] = useState <any>()
  useEffect(() => {
    if (user) {
      createNewUser();
    }
  }, [user]);

  const createNewUser = async () => {
    try {
      const result = await axios.post("/api/users");
      console.log("result", result.data);
      setUserDetail(result.data)
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return <div>
    <UserDetailContext.Provider value={{UserDetail,setUserDetail}}>
    {children}
    </UserDetailContext.Provider></div>; // Render children, not just a static <div>
};

export default Provider;
