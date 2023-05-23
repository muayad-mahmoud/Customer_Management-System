/* eslint-disable react/style-prop-object */
import Input from './TextField';
import '../App.css';
import Filecomponent from './FileUpload';
import { useEffect, useState } from "react";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Dropzone from 'react-dropzone'
import { useLocation } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';
const Form = (props) => {
    const navigate = useNavigate();
    const person = useLocation();
    var acceptedFileTypes = {
        'image/jpeg': [],
        'image/png': []
    }

    const [data, setData] = useState({
        bname: '',
        company: '',
        taxNo: '',
        PName: '',
        PPhone: '',
        Location: '',
        Logo: '',
        tartDate: '',
        endDate: '',
        Images: []

    });

    useEffect(() => {
        if (person.state != null) {
            setStart(new Date(person.state.StartDate));
            setEnd(new Date(person.state.EndDate));
            addFile(person.state.Images);
            console.log(person.state.Images);
            setData(person.state);
            console.log(typeof (data.Logo));
        }
    }, []);

    const [startDate, setStart] = useState(new Date());
    const [endDate, setEnd] = useState(new Date());
    const [files, addFile] = useState([]);
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData({ ...data, [name]: value });
    }
    const handleFileUpload = async (acceptedFiles) => {
        var newArr = [...files]

        acceptedFiles.forEach(element => {

            if (Array.isArray(element)) {
                element.array.forEach(item => {
                    newArr.push(item);
                });
            }
            else {
                newArr.push(element);
            }

        });
        //var newArr = files.concat(acceptedFiles);
        console.log(newArr);
        addFile(newArr);

    }
    const handleFileChange = (event) => {
        const name = event.target.name;
        const value = event.target.files[0];
        setData({ ...data, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        var submitDecision = window.location.href;
        console.log(submitDecision.includes('editUser'));
        const formData = new FormData();
        switch (submitDecision.includes('editUser')) {

            case true:
                /*Edit User Logic  Start*/

                for (const [key, value] of Object.entries(data)) {
                    formData.append(key, value)

                }
                console.log(formData);
                for (let index = 0; index < files.length; index++) {
                    const element = files[index];
                    const key = `image` + index.toString();
                    formData.append(key, element);

                }

                try {

                    const res = await axios.put("http://localhost:3005/editUser", formData);

                    console.log(res);
                    navigate('/users')
                } catch (error) {
                    console.log(error)
                }





                /*Edit User Logic End */

                break;

            default:

                for (const [key, value] of Object.entries(data)) {
                    formData.append(key, value)
                }
                for (let index = 0; index < files.length; index++) {
                    const element = files[index];
                    const key = `image` + index.toString();
                    formData.append(key, element);

                }

                try {
                    const res = await axios.post("http://localhost:3005/dataRegister", formData);
                    window.location.reload(false);
                    console.log(res);
                } catch (error) {
                    console.log(error)
                }
                break;
        }

    }
    return (
        <div className="min-h-full flex items-center justify-center w-full py-12 px-4 sm:px-6 lg:px-8">

            <form className="mt-8 space-y-6 space-x-2 " onSubmit={handleSubmit} method='POST' action="#" encType='multipart/form-data'>



                {
                    data.Logo != null ? <div className='w-full items-center flex mx-auto'><img className=" mx-auto h-32 w-32 rounded-full inline-block justify-self-center" src={typeof (data.Logo) === "string" ? `http://localhost:3005` + data.Logo.slice(1) : URL.createObjectURL(data.Logo)} alt="" /></div> : <div></div>
                }
                {
                    window.location.href.includes('editUser') ? <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900" >Edit Tenant</h2> : <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900" >Create Tenant</h2>
                }
                <Input style='input' name='bname' label='Brand name' type="text" patternn="^[^\s]+[a-zA-Z0-9\s]+$" onChanged={handleChange} value={data.bname} />

                <Input style='input' name='company' label='Company Name' type="text" patternn="^[a-zA-Z0-9,\s]+$" onChanged={handleChange} value={data.company} />
                <Input style='input' name='taxNo' label='Tax number' type="number" patternn="[0-9]" onChanged={handleChange} value={data.taxNo} />
                <Input style='input' name='PName' label='Contact Person Name' patternn="^[^\s]+[a-zA-Z0-9\s]+$" type="text" onChanged={handleChange} value={data.PName} />
                <Input style='input' name='PPhone' label='Contact Person Phone' type="tel" patternn="[0-9]{11}" max_length="11" onChanged={handleChange} value={data.PPhone} />
                <Input style='input' name='Location' label='Shop Location in The Mall' patternn="^[a-zA-Z0-9,\s]+$" type="text" onChanged={handleChange} value={data.Location} />
                <div className='w-full flex justify-evenly'>


                    <label className='block mb-2 mr-3 text-xs font-medium text-gray-900 dark:text-white'>

                        Start Date
                    </label>
                    <DatePicker minDate={Date.now()} showIcon selected={startDate} value={startDate} onChange={(date1, event) => {

                        setStart(date1);
                        //fix datePick
                        // eslint-disable-next-line no-useless-computed-key
                        setData({ ...data, ['startDate']: startDate });
                        console.log(date1);

                    }} />
                    <label className='block mb-2 mr-3 text-xs font-medium text-gray-900 dark:text-white'>
                        End Date
                    </label>
                    <DatePicker minDate={startDate} showIcon selected={endDate} value={endDate} onChange={(date2) => {

                        setEnd(date2);
                        console.log(date2);
                        // eslint-disable-next-line no-useless-computed-key
                        setData({ ...data, ['EndDate']: endDate });

                    }} />


                </div>
                <Filecomponent label_text='Upload' name='Logo' onChanged={handleFileChange} />
                <Dropzone accept={acceptedFileTypes} onDropAccepted={async (acceptedFiles) => {
                    await handleFileUpload(acceptedFiles);
                }

                    /*addFile(acceptedFiles.map(file => Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })))*/
                    /*if (files.length === 0) {
                        console.log(acceptedFiles);
                        addFile(acceptedFiles);
                        console.log(files.length);
                    }
                    else {
                        addFile((fileshist) => [...fileshist, acceptedFiles])
                        console.log(files.length);
                    }*/




                }>
                    {({ getRootProps, getInputProps, isDragAccept }) => (
                        <section>
                            <div className=' w-full h-20 border items-center justify-center flex'
                                {...getRootProps()}>

                                <input {...getInputProps()} />
                                {files.length === 0 && isDragAccept === false ?
                                    <button type="button" className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                                        Select files
                                    </button> :
                                    <p>You've Selected {files.length} </p>}
                            </div>
                        </section>
                    )}
                </Dropzone>
                {data.Images.length !== 0 ? <Carousel autoPlay={true} showThumbs={false} infiniteLoop={true} showArrows={false}>
                    {
                        data.Images.map((image, index) => (
                            <div className=' relative min-h-full'>
                                <div className=' absolute bg-white w-5'>
                                    <span key={index} className=' text-red-500' onClick={() => {
                                        var index = data.Images.indexOf(image);
                                        var temp_data = data.Images;
                                        temp_data.splice(index, 1);
                                        console.log(temp_data);
                                        addFile([...temp_data]);
                                        setData({ ...data, ['Images']: temp_data })

                                    }}>&times;</span>
                                </div>
                                <div className='w-full items-center flex mx-auto'><img className=" object-cover mx-auto h-32 w-32 inline-block justify-self-center" src={`http://localhost:3005` + image.slice(1)} alt="" /></div>
                            </div>
                        ))
                    }

                </Carousel> : <div></div>}
                <button type='submit' className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                    Submit Tenant
                </button>



            </form>

        </div>
    );
}

export default Form;