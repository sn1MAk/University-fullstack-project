import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { login } from '../services/auth';
import '../assets/SignIn.css'


import Brand from '../Components/Brand/Brand'
import HarborPhotograph from '../Components/HarborPhotograph/HarborPhotograph'
import Footer from '../Components/Footer/Footer'
import InputBox from '../Components/InputBox/InputBox'
import RememberMe from '../Components/RememberMe/RememberMe'
import Button from '../Components/Button/Button'
import Icon from '../Components/Icon/Icon'
import Google from '/GoogleLogo.svg'






export default function SignIn() {
  const navigate = useNavigate('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    console.log('form submitted');

    try {
      const data = await login(email, password);

      console.log('Login successful:', data);
      navigate('/signup');

    } catch (error) {
      console.log(error.message);
      setEmailError(true);
      setPasswordError(true);
    }
  }

  return (
    <div className="SignInContainer">
        <HarborPhotograph />

        <div className='SignInPanel'>
            <Brand />

            <div className='SignInForm'>
              <h1>Nice to see you again</h1>

              <form className='Credentials' id='signin-form' onSubmit={handleSubmit}>
                <InputBox isError={emailError} value={email} onChange={(e) => setEmail(e.target.value)} label = 'Login' placeholder='Email or phone number' />
                <InputBox isError={passwordError} value={password} onChange={(e) => setPassword(e.target.value)} type='password' label = 'Password' placeholder='Enter password' />
              </form>
              {/* <div>
              <p>{email}</p>
              <p>{password}</p>
              </div> */}
              <div className='SignInPreferences'>
                <RememberMe />

                <div className='ForgotPass'>
                  <a href="#">Forgot password?</a>                  
                </div>
              </div>

              <div className='PrimaryAction'>
                  <Button type='submit' form='signin-form' title='Sign in' className='simple' />
              </div>

              <div className='AlternativeSignIn'>
                <hr />
                <Button title='Or sign in with Google' className='google'><Icon src={Google} /></ Button>
                <Link to='/signup'><Button title='Sign up' className='simple' /></Link>
              </div>

              <div className='CreateAccount'>
                <p>Don't have an account?</p>
                <Link to='/signup'>Sign up now</Link>
              </div>
            </div>

            <Footer />
        </div>
    </div>
  )
}