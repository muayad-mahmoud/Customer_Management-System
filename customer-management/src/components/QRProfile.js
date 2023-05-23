/* eslint-disable jsx-a11y/alt-text */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from 'react-router';
import TextComponent from "./textComponent";
import { Carousel } from 'react-responsive-carousel';
import { HiOutlineOfficeBuilding } from 'react-icons/hi'
import { RxAvatar } from 'react-icons/rx';
import { AiOutlinePhone, AiOutlinePushpin } from 'react-icons/ai';
const QrProfile = (props) => {
    const [data, setData] = useState({})
    const { id } = useParams();
    console.log(id);

    async function fetchUser(id) {
        try {
            await axios.get('http://localhost:3005/getuser', {
                params: {
                    id: id
                }
            }).then((response) => {
                const dataRecieved = response.data;
                setData({ ...dataRecieved });

            });
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        console.log('started');
        fetchUser(id);

    }, []);
    return (

        Object.keys(data).length !== 0 ? <div className="relative w-full h-full bg-white">
            {data.Images.length !== 0 ? <div className="w-full items-center justify-center flex object-contain">
                <Carousel autoPlay={true} showThumbs={false} infiniteLoop={true} showArrows={false} className="w-full min-h-full">
                    {data.Images.map((image, index) => (
                        <div className=' relative h-full'>

                            <div className='w-full h-full items-center flex mx-auto'><img className=" object-cover mx-auto max-h-96 inline-block justify-self-center" src={`http://localhost:3005` + image.slice(1)} alt="" /></div>
                        </div>))}
                </Carousel>
            </div> : <div></div>}
            <img className=" rounded-full h-32 w-32  bg-transparent border-4 border-white absolute top-80 left-0 lg:top-80 lg:left-10 " src={data.Logo ? `http://localhost:3005` + data.Logo.slice(1) : ''} />
            <div className="w-full items-start justify-start p-10">
                <div className=" w-full lg:w-4/6 md:w-4/6">
                    <TextComponent text={data.bname} className='py-6 text-[#1d2b5c]/[1] font-serif text-5xl text-black justify-start items-start w-full left-0 right-0' />
                    <div className=" max-w-full lg:space-x-4  ">
                        {
                            Date.now() < new Date(data.EndDate) ? <span
                                className="px-2 text-xs leading-5
                      font-semibold rounded-full bg-green-100 text-green-800 animate-pulse w-10"
                            >
                                Contract Ongoing
                            </span> :
                                <span
                                    className="px-2 text-xs leading-5
                      font-semibold rounded-full bg-red-100 text-red-800 animate-pulse w-10 -my-10"
                                >
                                    Contract Ended
                                </span>


                        }
                        <span
                            className="px-2 text-xs leading-5
                      font-semibold rounded-full bg-green-100 text-green-800 w-10"
                        >
                            {'Since: ' + new Date(data.StartDate).toISOString().split('T')[0]}
                        </span>
                    </div>
                </div>
                <TextComponent text='Tenant Information' className='text-4xl py-5 text-[#3b4461]/[1]' />
                <div className="flex justify-between w-1/2  sm: flex-col md:flex-col lg:flex-row lg:w-1/2 ">
                    <div className="flex">
                        <HiOutlineOfficeBuilding size={36} color={"#4B5563"} />
                        <TextComponent text={'Company: ' + data.company} className='text-2xl text-gray-600 justify-center items-center w-full  right-0' />
                    </div>
                    <div className="flex">
                        <HiOutlineOfficeBuilding size={36} color={"#4B5563"} />
                        <TextComponent text={'Tax Number: ' + data.taxNo} className='text-2xl text-gray-600 justify-center items-center w-full  right-0' />
                    </div>


                </div>
                <div className="py-5 justify-betwn sm:flex-col md:flex-col lg:flex-row lg:w-4/5">
                    <div className="flex">
                        <RxAvatar size={36} color={"#4B5563"} />
                        <TextComponent text={'Business Owner: ' + data.PName} className='text-2xl text-gray-600 justify-center items-center w-full' />

                    </div>
                    <div className="flex">
                        <AiOutlinePhone size={36} color={"#4B5563"} />
                        <TextComponent text={'Business Owner Phone: ' + data.PPhone} className='text-2xl text-gray-600 justify-center items-center w-full' />

                    </div>
                    <div className="flex">
                        <AiOutlinePushpin size={36} color={"#4B5563"} />
                        <TextComponent text={'Location: ' + data.Location} className='text-2xl text-gray-600 justify-center items-center w-full' />

                    </div>
                </div>

            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#312E81" fill-opacity="1" d="M0,128L20,117.3C40,107,80,85,120,74.7C160,64,200,64,240,74.7C280,85,320,107,360,128C400,149,440,171,480,176C520,181,560,171,600,154.7C640,139,680,117,720,112C760,107,800,117,840,128C880,139,920,149,960,138.7C1000,128,1040,96,1080,106.7C1120,117,1160,171,1200,181.3C1240,192,1280,160,1320,149.3C1360,139,1400,149,1420,154.7L1440,160L1440,320L1420,320C1400,320,1360,320,1320,320C1280,320,1240,320,1200,320C1160,320,1120,320,1080,320C1040,320,1000,320,960,320C920,320,880,320,840,320C800,320,760,320,720,320C680,320,640,320,600,320C560,320,520,320,480,320C440,320,400,320,360,320C320,320,280,320,240,320C200,320,160,320,120,320C80,320,40,320,20,320L0,320Z"></path></svg>
        </div> :
            <div></div>

    );

};

export default QrProfile;