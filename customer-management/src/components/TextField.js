
const Input = (props) => {
    const {
        id,
        name = ''
        ,
        wrapperClassName = 'justify-center items-center',
        label = '',
        onChanged = () => { },
        max_length = '',
        placeholder = '',

        patternn,
        style = '',
        type = 'text',
        error = '',
        required = false,
        value = '',
        ...rest
    } = props;
    return (
        <div className={wrapperClassName}>
            <label>{label}</label>
            <input type={type} className={style} onChange={onChanged} name={name} maxLength={max_length} pattern={patternn} value={value} />
        </div>
    );
}

export default Input;