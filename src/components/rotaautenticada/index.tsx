import { Loader } from 'components/common'
import { signIn, useSession } from 'next-auth/client'
import React, { useState } from 'react';

interface RotaAutenticadaProps {
    children: React.ReactNode
}

export const RotaAutenticada: React.FC<RotaAutenticadaProps> = ({
    children
}) => {

    const [ session, loading ] = useSession()
      
    if(loading){
      return (
          <Loader show />
      )
  }

  if(!session && !loading){
      signIn()
      return null
  }


  return (
      <div>
          <p>Signed in as {session?.user?.email}</p>
          {children}
      </div>
  )
}