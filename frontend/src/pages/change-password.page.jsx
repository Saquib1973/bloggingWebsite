import React, { useContext, useRef } from 'react'
import AnimationWrapper from '../common/page-animation'
import InputBox from '../components/input.component'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { UserContext } from '../App'

const ChangePassword = () => {
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    let { userAuth: { access_token } } = useContext(UserContext)
    const changePassRef = useRef()
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('clicked')
        let form = new FormData(changePassRef.current);
        let formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }
        let { currentPassword, newPassword } = formData;
        if (!currentPassword.length || !newPassword.length)
            return toast.error("Password Missing");
        if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
            return toast.error("Password should be 6 to 12 character long with a numeric , 1 lowercase and 1 uppercase letter")
        }
        e.target.setAttribute("disabled", true);
        let loadingToast = toast.loading("Updating Password");
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/change-password", formData,
            {
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                }
            }
        ).then(() => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled")
            document.getElementById("form").reset();
            return toast.success("Password Updated");
        }).catch(({ response }) => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled")
            return toast.error(response.data.error);

        })
    }
    return (
        <AnimationWrapper>
            <Toaster />
            <form ref={changePassRef} id='form' className='h-[calc(100vh-120px)] flex flex-col max-md:pt-10'>
                <h1 className='max-md:hidden'>Change Password</h1>
                <div className='py-10 w-full md:max-w-[400px] flex items-center justify-center flex-col gap-2'>
                    <InputBox name={'currentPassword'} type={'password'} className={"profile-edit-input"} placeholder={'Current Password'} icon={'fi-rr-unlock'} />
                    <InputBox name={'newPassword'} type={'password'} className={"profile-edit-input"} placeholder={'New Password'} icon={'fi-rr-unlock'} />
                    <button className='btn-dark px-10' type='submit' onClick={handleSubmit}>
                        Change Password
                    </button>
                </div>
            </form>
        </AnimationWrapper>
    )
}

export default ChangePassword