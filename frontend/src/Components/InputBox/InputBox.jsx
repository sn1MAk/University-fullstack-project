import './InputBox.css'

export default function InputBox({label, placeholder, type='text', onChange, value, isError}) {
    return (
        <div className='input-box'>
            <label htmlFor="">{label}</label>
            <input className={isError ? 'error' : null} value ={value} onChange={onChange} type={type} placeholder={placeholder} />
        </div>
    )
}