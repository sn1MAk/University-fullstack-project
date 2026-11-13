import './Button.css'

export default function Button({children, title, className, form, type='button'}) { 
    return(
        <button type={type} form={form} className={className}>{children}{title}</button>
    )
}