/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import dropDown from './Drawer';
import Modal from 'react-modal';
import QRCode from "react-qr-code";
const Table = (props) => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [paginationCount, setPagination] = useState({ start: 0, count: 7 });
    const [modalIsOpen, setModal] = useState(false);
    const [personData, setpersonData] = useState({});
    function printQR(personDataz) {
        if (personDataz !== null) {
            if (personDataz !== "pass") {
                setpersonData(personDataz);
                openModal();
            }
            if (personDataz === "pass") {
                var content = document.getElementById("printable");
                var pri = document.getElementById("ifmcontentstoprint").contentWindow;
                pri.document.open();
                pri.document.write(`<div>${content.innerHTML}</div>`);

                pri.document.close();
                console.log(pri.document);
                pri.focus();
                pri.print();
            }
        }
    }
    function openModal() {
        setModal(true);
    }
    function closeModal() {
        setModal(false);
    }

    const handleSearch = (event) => {
        setSearch(event.target.value);
    }
    async function fetchData(steps, initial) {
        // console.log(paginationCount.start);
        // console.log(paginationCount.count);
        try {
            if (initial) {
                await axios.get('http://localhost:3005/getData', {
                    params: {
                        start: paginationCount.start,
                        count: paginationCount.count
                    }
                }).then((response) => {
                    if (!(Object.keys(response.data).length === 0)) {
                        const dataz = response.data;

                        setData(dataz);

                    }

                });
            }
            else {
                if (steps > 0) {

                    await axios.get('http://localhost:3005/getData', {
                        params: {
                            start: paginationCount.start + steps,
                            count: paginationCount.count + steps
                        }
                    }).then((response) => {
                        console.log(paginationCount.start + steps);
                        console.log(paginationCount.count + steps);
                        if (!(Object.keys(response.data).length === 0)) {
                            const dataz = response.data;

                            setData(dataz);

                            var tempObj = { start: paginationCount.count, count: paginationCount.count + steps };

                            setPagination({ ...tempObj })

                        }

                    });
                }
                else {
                    // console.log(steps);
                    switch (paginationCount.start) {
                        case 0:

                            break;

                        default:
                            // if (!(Object.keys(data).length) < Math.abs(steps)) {
                            //     steps = (Object.keys(data).length) * -1
                            //     console.log(steps)
                            // }

                            await axios.get('http://localhost:3005/getData', {
                                params: {
                                    start: paginationCount.start + steps,
                                    count: paginationCount.count + steps
                                }
                            }).then((response) => {
                                console.log(paginationCount.start + steps);
                                console.log(paginationCount.count + steps);
                                if (!(Object.keys(response.data).length === 0)) {

                                    const dataz = response.data;

                                    setData(dataz);
                                    var tempObj = { start: paginationCount.start + steps, count: paginationCount.count + steps };

                                    setPagination({ ...tempObj })

                                }

                            });
                            break;
                    }

                }
            }





        } catch (error) {
            console.log(error)
        }
    }
    async function deleteUser(id, person) {
        const formData = new FormData()
        formData.append('id', id)
        try {
            await axios.delete('http://localhost:3005/deleteUser', { data: formData }).then((response) => {
                console.log(response.status)
                if (response.status === 200) {
                    var index = data.indexOf(person);
                    console.log(index)
                    if (index !== -1) {

                        let temp = data;
                        temp.splice(index, 1)
                        setData([...temp]);


                    }

                }
                else {
                    alert('failed');
                }
            })

        } catch (error) {
            console.log(error)

        }
    }
    useEffect(() => {

        fetchData(7, true);

    }, []);
    const navigate = useNavigate();
    const customStyles = {
        content: {

            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255,255,255,1)',




        },
        overlay: {
            border: '1rem',
            borderColor: 'black',
            height: '100%',
            width: '100%',

            zIndex: 1000,
            backgroundColor: 'rgba(255,255,255,0.1)',

        }
    };
    return (
        <div className="flex flex-col">
            <iframe id="ifmcontentstoprint" style={{ height: '0px', width: '100vw', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px', borderColor: 'black' }

            } className='flex-row flex'></iframe>
            <Modal
                isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
                <div id='printable' className=' w-auto lg:w-full flex justify-normal'>
                    <QRCode size={256} value={personData._id} />
                    <div className='mx-5 flex '>

                        <ul>
                            <li className='py-3'>{'Bname: ' + personData.bname}</li>
                            <li className='py-3'>{'Company: ' + personData.company}</li>
                            <li className='py-3'>{'Owner Name: ' + personData.PName}</li>
                            <li className='py-3'>{'Owner Phone: ' + personData.PPhone}</li>
                            <li className='py-3'>{'Location: ' + personData.Location}</li>

                        </ul>


                    </div>
                </div>
                <button className=" mt-5 w-full bg-transparent hover:bg-indigo-500 text-indigo-600 font-semibold hover:text-indigo-900 py-2 px-4 border border-indigo-500 hover:border-transparent rounded"
                    onClick={() => {
                        printQR("pass");
                    }}
                >
                    Print
                </button>
            </Modal>
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">

                        <label htmlFor="search">
                            Search by Task:
                            <input id="search" type="text" onChange={handleSearch} />
                        </label>

                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Phone
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Location
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Tax Number
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Start Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        End Date
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {
                                    data.filter((row) => !search.length || row.bname
                                        .toString()
                                        .toLowerCase()
                                        .includes(search.toString().toLowerCase())).map((person, index) => (

                                            <tr key={index}>

                                                <td className="px-6 py-4 whitespace-nowrap">



                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img className="h-10 w-10 rounded-full" src={`http://localhost:3005` + person.Logo.slice(1)} alt="" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <a className="text-indigo-600 hover:text-indigo-900" onClick={() => { printQR(person) }}>{person.bname}</a>
                                                            <div className="text-sm text-gray-500">{person.company}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{'+20' + person.PPhone}</div>
                                                    <div className="text-sm text-gray-500">{person.department}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">


                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {person.Location}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {person.taxNo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(person.StartDate).toLocaleDateString("en-US")}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(person.EndDate).toLocaleDateString("en-US")}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <a className="text-indigo-600 hover:text-indigo-900" onClick={() => navigate(`/editUser`, { state: person })}>
                                                        Edit
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <a className="text-indigo-600 hover:text-indigo-900" onClick={async () => {
                                                        await deleteUser(person._id, person);

                                                    }}>
                                                        Delete
                                                    </a>
                                                </td>

                                            </tr>


                                        ))}

                            </tbody>
                        </table>

                    </div>
                    <div className='flex items-end justify-end w-full' >
                        <button className=" m-5 bg-transparent hover:bg-indigo-500 text-indigo-600 font-semibold hover:text-indigo-900 py-2 px-4 border border-indigo-500 hover:border-transparent rounded"
                            onClick={() => {
                                fetchData(-7, false);
                            }}>
                            Previous
                        </button>
                        <button className=" m-5 bg-transparent hover:bg-indigo-500 text-indigo-600 font-semibold hover:text-indigo-900 py-2 px-4 border border-indigo-500 hover:border-transparent rounded"
                            onClick={() => {
                                fetchData(7, false);
                            }}
                        >
                            Next
                        </button>

                    </div>

                </div>
            </div>

        </div>
    );
}

export default Table;