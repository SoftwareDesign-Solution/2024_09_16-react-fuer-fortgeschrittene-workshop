import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/authActions";

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string
};

const Register = () => {

    const dispatch = useDispatch();

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
      } = useForm<FormData>();

      const onSubmit = async (data: FormData) => {
        
        console.log(data);

        //await axios.post("http://localhost:3001/register", data);

        await dispatch(registerUser({ ...data }));

        reset();

    };

    return (
        <>
            <div className="flex min-h-full flex-col justify-center">
                
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h1 id="title" className="text-2xl">Registrierung</h1>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

                    <form className="space-y-6" method="POST" onSubmit={handleSubmit(onSubmit)}>
                        
                        {/* Vorname */}
                        <div>
                            <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900">Vorname</label>
                            <div className="mt-2">
                                <input 
                                    type="text" 
                                    id="firstName" 
                                    placeholder="Max"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:text-gray-900 sm:text-sm sm:leading-6"
                                    {...register('firstName', { required: 'Vorname ist erforderlich' })}
                                />
                            </div>
                            {errors.firstName && (<div className="mt-2 text-red-600">{errors.firstName.message}</div>)}
                        </div>

                        {/* Nachname */}
                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium leading-6 text-gray-900">Nachname</label>
                            <div className="mt-2">
                                <input 
                                    type="text" 
                                    id="lastName"
                                    placeholder="Mustermann"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:text-gray-900 sm:text-sm sm:leading-6"
                                    {...register('lastName', { required: 'Nachname ist erforderlich' })}
                                    
                                />
                            </div>
                            {errors.lastName && (<div className="mt-2 text-red-600">{errors.lastName.message}</div>)}
                        </div>

                        {/* E-Mail */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">E-Mail</label>
                            <div className="mt-2">
                                <input 
                                    type="text" 
                                    id="email" 
                                    placeholder="you@example.com"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:text-gray-900 sm:text-sm sm:leading-6"
                                    {...register('email', { required: 'E-Mail ist erforderlich', pattern: { value: /^\S+@\S+$/i, message: 'Ungültige E-Mail-Adresse' } })}
                                />
                            </div>
                            {errors.email && (<div className="mt-2 text-red-600">{errors.email.message}</div>)}
                        </div>
                        
                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            <div className="mt-2">
                                <input 
                                    type="password"  
                                    id="password" 
                                    placeholder=""
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:text-gray-900 sm:text-sm sm:leading-6"
                                    {...register('password', { required: 'Passwort ist erforderlich', minLength: { value: 8, message: 'Mindestens 8 Zeichen' } })}
                                />
                            </div>
                            {errors.password && (<div className="mt-2 text-red-600">{errors.password.message}</div>)}
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