const Filecomponent = (props) => {
    const {
        label_text,
        name = '',
        onChanged = () => { },
        ...rest
    } = props
    return (
        <div className="block max-w-full">

            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >{label_text}</label>
            <input name={name} onChange={onChanged} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" id="file_input" type="file" />

        </div>
    );
}

export default Filecomponent;