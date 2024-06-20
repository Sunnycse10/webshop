import { useState } from "react";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
const editAccount = () => {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { data: session, status } = useSession();
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('http://localhost:8000/api/change-password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access}`
                
            },
            body: JSON.stringify({
                old_password: oldPassword,
                new_password: newPassword
            })
        });
        const message = await res.json()

        if (!res.ok) {
            toast.error(`${message.detail || "something went wrong"}`);
        }
        else {
            toast.success("password changed successfully");
            router.push("/");
        }
    };

    return (
        <Layout>
            <div className="login-container">
                <h2>Change Password</h2>
                <form onSubmit={handleSubmit} method="POST">
                <div className="form-group">
                        <label htmlFor="oldpassword">old password:</label>
                        <input type="password" id="oldPassword" name="oldPassword" required value={ oldPassword} onChange={(e)=>setOldPassword(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">new password:</label>
                        <input type="password" id="newPassword" name="newPassword" required value={ newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
                    </div>
                    <button type="submit">Submit</button>
                </form>
                
            </div>
        </Layout>
    )


    
}

export default editAccount;