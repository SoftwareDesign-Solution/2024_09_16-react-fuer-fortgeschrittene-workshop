import { useState } from "react";
import axios from "axios";

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string
};

const Register = () => {

    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Aufgabe: Übermitteln Sie die Daten an den JSON-Server http://localhost:3001/login
        const response = await axios.post("http://localhost:3001/register", formData);
        console.log(response.data);

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        
    };

    return (
        <>
            <div className="flex min-h-full flex-col justify-center">
                
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h1 id="title" className="text-2xl">Registrierung</h1>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

                    <form className="space-y-6" method="POST" onSubmit={e => handleSubmit(e)}>
                        
                        {/* Vorname */}
                        <div>
                            <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900">Vorname</label>
                            <div className="mt-2">
                                <input 
                                    type="text" 
                                    name="firstName" 
                                    id="firstName" 
                                    value={formData.firstName} 
                                    onChange={e => handleChange(e)} 
                                    placeholder="Max"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:text-gray-900 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* Nachname */}
                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium leading-6 text-gray-900">Nachname</label>
                            <div className="mt-2">
                                <input 
                                    type="text" 
                                    name="lastName" 
                                    id="lastName" 
                                    value={formData.lastName} 
                                    onChange={e => handleChange(e)} 
                                    placeholder="Mustermann"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:text-gray-900 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* E-Mail */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">E-Mail</label>
                            <div className="mt-2">
                                <input 
                                    type="text" 
                                    name="email" 
                                    id="email" 
                                    value={formData.email} 
                                    onChange={e => handleChange(e)} 
                                    placeholder="you@example.com"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:text-gray-900 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        
                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            <div className="mt-2">
                                <input 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    value={formData.password} 
                                    onChange={e => handleChange(e)} 
                                    placeholder=""
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:text-gray-900 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div>
                            <button type="submit" id="register" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>
                        </div>

                    </form>
                </div>

            </div>
        </>
    )
};

export { Register };