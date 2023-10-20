import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Token";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const FetchToken = async (data: { email: string, password: string }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { accessToken, setAccessToken, userName } = useAuth();
  const { email, password } = data;

  try {
    const loginResponse = await fetch(`${BACKEND_URL}token/`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (loginResponse.ok) {
      const responseData = await loginResponse.json();
      const newAccessToken = responseData.access;
      //localStorageにアクセストークンを格納
      localStorage.setItem('accessToken', newAccessToken);
      setAccessToken(newAccessToken);
      navigate('/');
    } else {
      const errorData = await loginResponse.json();
      setErrorMessage(errorData.message);
    }
  } catch (error) {
    if (error instanceof Error) {
      setErrorMessage(error.message);
    }
  }
}


// export default FetchToken;