import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/auth';
import { useState } from 'react';
import '../assets/SignUp.css'

import HarborPhotograph from '../Components/HarborPhotograph/HarborPhotograph'
import Brand from '../Components/Brand/Brand'
import Footer from '../Components/Footer/Footer'
import InputBox from '../Components/InputBox/InputBox'
import Button from '../Components/Button/Button'
import Icon from '../Components/Icon/Icon'
import Google from '/GoogleLogo.svg'

export default function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await register(username, email, password);

      navigate('/signin');

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="SignUpContainer">
      <HarborPhotograph />

      <div className='SignUpPanel'>
        <Brand />

        <div className='RegistrationForm'>
          <h1>Create your account</h1>

          <form id='signup-form' className='AccountDetails' onSubmit={handleSubmit}>
                        {error && <p>{error}</p>}
            <InputBox isError={error} value={username} onChange={(e) => setUsername(e.target.value)} label='Full name' placeholder='Enter your full name' />
            <InputBox isError={error} value={email} onChange={(e) => setEmail(e.target.value)} label='Email' placeholder='Enter your email address' />
            <InputBox isError={error} value={password} onChange={(e) => setPassword(e.target.value)} label='Password' placeholder='Create a password' />
            <InputBox isError={error} label='Confirm password' placeholder='Re-enter password' />
          </form>

          <div className='PasswordGuidance'>
            <p>Use 8 or more characters.</p>
          </div>

          <div className='TermsAgreement'>
            <input type="checkbox" />
            <p>I agree to the <a href="#">Terms of Service</a> and <br /> <a href='#'>Privacy Policy</a>.</p>
          </div>

          <div className='PrimaryAction'>
            <Button type='submit' form='signup-form' title={loading ? 'Creating account...' : 'Create Account'} className='simple' />
          </div>

          <div className='AlternativeSignUp'>
            <hr />
            <Button title='Or sign up with Google' className='google'><Icon src={Google}/></Button>
          </div>

          <div className='SignIn'>
            <p>Already have an account?</p>
            <Link to='/signin'>Sign in</Link>
          </div>
        </div>


        <Footer />
      </div>
    </div>
  )
}