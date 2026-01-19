import '../App.css'
import API_URL from '../config';
import { Link } from "react-router-dom"
import { TextAnimate } from "@/components/ui/text-animate.jsx"
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getCsrfToken, fetchCsrfToken } from '@/utils/csrf';



function Login(){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      email: "",
      password: ""
    })

    const[showPassword, setShowPassword] = useState(false)

    useEffect(() => {
      fetchCsrfToken();
    }, [])

    const handleChange = (e) => {
      const {name, value} = e.target
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

     const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        const csrftoken = getCsrfToken()

        const response = await fetch(`${API_URL}/api/login/`, {
        method: "POST",            
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("error")

      const data = await response.json()

      navigate("/main")

      } catch(error) {
        console.error(error)
      }
    };
    return (
        <>
          <div className='ab-main-container'>
            <div className='lg-button-back-container'>
                <Link to="/">
                  <button className="lg-back-button">
                    <svg  xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z"/></svg>
                  </button>
                </Link>
            </div>
            <TextAnimate className={"lg-login-register-title"} animation="blurInUp" by="character" accessible={false} duration={1}>
              Welcome back!
            </TextAnimate>
            <form className='lg-form' onSubmit={handleSubmit}>
                <img className='lg-logo-image' src="/images/VantaLinks_favicon.png" alt="Vanta Links Logo" />
                <div className='lg-container-buttons-form'>
                  <input 
                    className='lg-input-button' 
                    name='email' 
                    value={formData.email}
                    onChange={handleChange} 
                    type="email" 
                    placeholder='Email' 
                    required/>
                  <div className='lg-container-input-password'>
                    <input 
                      className='lg-input-button-password'
                      autoComplete='off' 
                      name='password' 
                      value={formData.password}
                      onChange={handleChange} 
                      type={showPassword ? "text" : "password"} 
                      placeholder='Password' 
                      required/>
                    <span className='lg-show-password-button' onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ?
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3.275 15.296C2.425 14.192 2 13.639 2 12c0-1.64.425-2.191 1.275-3.296C4.972 6.5 7.818 4 12 4s7.028 2.5 8.725 4.704C21.575 9.81 22 10.361 22 12c0 1.64-.425 2.191-1.275 3.296C19.028 17.5 16.182 20 12 20s-7.028-2.5-8.725-4.704Z"/><path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"/></g></svg>
                      :
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 9q-3.6 4-9 4T3 9m0 6l2.5-3.8M21 14.976L18.508 11.2M9 17l.5-4m5.5 4l-.5-4"/></svg> 
                      }
                    </span>
                  </div>
                  <br />
                  <input className="lg-input-submit-button" type="submit" value="Log In" />
                </div>
            </form>
          </div>     
        </>
      )
}

export default Login