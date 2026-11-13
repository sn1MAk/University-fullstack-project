import './RememberMe.css'

export default function RememberMe() { 
    return(
        <div className='RememberMe'>
            <input type="checkbox" id="checkbox" />
            <label htmlFor="checkbox"></label>
            <span>Remember me</span>
        </div>
    )
}