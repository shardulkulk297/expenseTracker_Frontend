import axios from 'axios';
import React, { use, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate()

    useEffect(() => {
        const removeToken = () => {
            localStorage.clear();
        }
        removeToken();
    }, [])

    const loginUser = async (e) => {
        e.preventDefault();

        try {

            let encodedString = window.btoa(username + ":" + password)

            const getToken = await axios.get("http://localhost:8081/api/user/getToken", {
                headers: { "Authorization": "Basic " + encodedString }
            })
            const token = getToken.data;
            console.log(token);

            if (token) {
                localStorage.setItem("token", token);


                const response = await axios.get(
                    "http://localhost:8081/api/user/getLoggedInUserDetails",
                    {
                      headers: { Authorization: `Bearer ${token}` }
                    }
                  );
            
                const User = response.data;
                console.log(User);

                if (User.user.role === "FINANCER") {
                    console.log("LOGIN SUCCESS");
                    toast.success("LOGIN SUCCESS");
                    navigate("/financer")
                }



            }



        } catch (error) {
            console.log(error);
            toast.error("BAD CREDENTIALS");
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
                            Login
                        </div>

                        <div className='card-body'>
                            <form action="" onSubmit={loginUser}>

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

                                    <button className='btn btn-primary '>Login</button>

                                </div>

                            </form>

                        </div>
                        <div className='m-2'>
                            <p>Don't have an account? <Link to="/signup">Sign Up Here</Link></p>
                        </div>




                    </div>

                </div>

            </div>

        </div>
    )
}

export default Login