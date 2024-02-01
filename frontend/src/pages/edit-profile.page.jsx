import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../App'
import axios from 'axios'
import { profileData } from './profile.page';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import { Toaster } from 'react-hot-toast';
import InputBox from '../components/input.component';
import { motion } from "framer-motion"

const EditProfile = () => {
    const bioLimit = 150;
    let { userAuth: { access_token }, userAuth } = useContext(UserContext);
    const [profile, setProfile] = useState(profileData);
    const [loading, setLoading] = useState(true);
    const [charactersLeft, setCharactersLeft] = useState(bioLimit)
    let { personal_info: { fullname, username: profile_username, profile_img, email, bio }, social_links } = profile;
    useEffect(() => {
        if (access_token) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-profile', { username: userAuth.username }).then(({ data }) => {
                setProfile(data);
                setLoading(false)
            }).catch(err => {
                console.log(err)
            })
        }
    }, [access_token])
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const mouseMove = (e) => {
        const { clientX, clientY } = e;
        let { width, height, left, top } = ref.current.getBoundingClientRect();
        // console.log('clientX', clientX, 'clientY', clientY, 'width', width, 'height', height, 'left', left, 'top', top)
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        const newX = ((clientX - left) / ref.current.offsetWidth) - 0.5;
        const newY = ((clientY - top) / ref.current.offsetHeight) - 0.5;
        setPosition({ x: newX * 50, y: newY * 50 })
    }
    const mouseLeave = (e) => {
        setPosition({ x: 0, y: 0 });
    }
    const { x, y } = position;
    return (
        <AnimationWrapper>
            {
                loading ? <Loader /> : <form >
                    <Toaster />
                    {/* <motion.div ref={ref} className='h-40 w-40 rounded-full border border-dark-grey p-4'>
                        Test animation
                    </motion.div> */}
                    <h1 className='max-md:hidden'>Edit Profile</h1>
                    <div className='flex flex-col items-center py-10 gap-8 lg:gap-10'>
                        <div className='max-lg:center mb-5'>
                            <motion.label ref={ref} animate={{ x, y }} transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }} onMouseMove={mouseMove} onMouseLeave={mouseLeave} htmlFor='uploadImage' id='profileImageLabel' className='border-4 border-white hover:border-red relative block w-48 h-48 bg-grey rounded-full overflow-hidden' >
                                <div className='w-full h-full absolute top-0 left-0 flex items-center justify-center text-gray-200 text-xl bg-gray-950/50 opacity-0 hover:opacity-100 cursor-pointer'>
                                    Upload Image
                                </div>
                                <img src={profile_img} alt="" />

                            </motion.label>
                            <input type="file" id='uploadImage' accept='.jpeg .png .jpg' hidden />
                            <button className='btn-light mt-5 max-lg:center lg:w-full'>Upload</button>

                        </div>
                        <div className='w-full'>
                            <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5 '>
                                <div>
                                    <InputBox name={'fullname'} type={'text'} value={fullname} placeholder={'Fullname'} disable={true} icon={'fi-rr-user'} />
                                </div>
                                <div>
                                    <InputBox name={'email'} type={'email'} value={email} placeholder={'Email'} disable={true} icon={'fi-rr-envelope'} />
                                </div>
                            </div>
                            <InputBox type={'text'} name={'username'} value={profile_username} placeholder={'Username'} icon={'fi-rr-at'} />
                            <p className='text-dark-grey/80 -mt-3 text-xs text-right'>Username is used to search users and is visible to everyone</p>
                            <textarea name="bio" maxLength={bioLimit} defaultValue={bio} className='input-box  mt-5 pl-5 leading-7 h-64 lg:h-40 resize-none' placeholder='Bio' onChange={(e) => {
                                setCharactersLeft(bioLimit - e.target.value.length)
                            }}></textarea>
                            <p className='mt-1 text-xs text-dark-grey/80 text-right'>characters left <span className={`text-xs ${charactersLeft === 0 ? "text-red" : ""}`} >{charactersLeft}</span></p>
                            <p className='my-6 text-dark-grey'>Add your Social Handles below :</p>
                            <div className='md:grid md:grid-cols-2 gap-x-6'>
                                {
                                    Object.keys(social_links).map((key, i) => {
                                        let link = social_links[key];

                                        return <InputBox key={i} name={key} type={'text'} value={link} placeholder={'https://'} icon={`fi ${key !== "website" ? "fi-brands" : "fi-rr"
                                            }-${key !== "website" ? key : "globe"
                                            }`} />
                                    })
                                }
                            </div>
                            <button className=' btn-dark w-auto px-10' type='submit'>Update </button>
                        </div>
                    </div>
                </form>
            }
        </AnimationWrapper>
    )
}

export default EditProfile