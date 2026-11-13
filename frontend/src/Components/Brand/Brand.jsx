import './Brand.css'
import logo from '/LighthouseSymbol.svg'

export default function Brand() { 
    return(
        <div className='Brand'>
            <img src={logo} alt="" />
            <p>Lighthouse</p>
        </div>
    )
}