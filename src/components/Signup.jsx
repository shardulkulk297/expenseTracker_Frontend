import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");

    const navigate = useNavigate();
    


    const signupUser = async(e)=>{

        e.preventDefault();

        try {
            const response  = await axios.post("http://localhost:8081/api/financer/add",{
                "user": {
                    "username": username,
                    "password": password
                },
                "name": name,
                "email": email,
                "contact": contact
            })
            console.log(response.data);
            toast.success("Signup Successful");
            navigate("/")

        } catch (error) {
            console.log(error);
            toast.error("SIGNUP FAILED")
        }

    }

    return (
        <div className='container py-5'>
            <div>
                <h1 className='m-3'>PFT - Personal Finance Tracker</h1>
                
            </div>

            <div className='row d-flex justify-content-center align-items-center'>

                <div className='col-md-auto'>

                    <div className='card shadow-sm' style={{ width: "30rem" }}>

                        <div className='card-header'>
                            Signup
                        </div>

                        <div className='card-body'>
                            <form action="" onSubmit={signupUser}>

                                <div className='mb-4'>
                                    <input type="text" className='form-control' placeholder='Enter Username'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className='mb-4'>
                                    <input type="password" className='form-control' placeholder='Enter Password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className='mb-4'>
                                    <input type="text" className='form-control' placeholder='Enter your name' value={name}
                                    onChange={(e)=>setName(e.target.value)}
                                    />
                                </div>
                                <div className='mb-4'>
                                    <input type="text" className='form-control' placeholder='Enter your email' 
                                    value={email}
                                    onChange={(e)=> setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <input type='text' className='form-control' placeholder='Enter your contact number'
                                    value={contact}
                                    onChange={(e)=>setContact(e.target.value)}
                                    />
                                </div>
                                
                                <div className='mb-4'>

                                    <button className='btn btn-primary '>Signup</button>

                                </div>

                            </form>

                        </div>
                        <div className='m-2'>
                            <p>Already Have an account? <Link to="/">Login Here</Link></p>
                        </div>



                    </div>

                </div>

            </div>

        </div>
    )
}

export default Signup