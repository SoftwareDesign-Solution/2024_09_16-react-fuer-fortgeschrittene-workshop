import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/authcontext/AuthContext";

type FormData = {
    email: string;
    password: string
};

const Login = () => {

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const { login, accessToken } = useAuth();

    const onSubmit = async (data: FormData) => {

        console.log(data);

        /*
        const response = await axios.post("http://localhost:3001/login", data);

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        */

        await login(data.email, data.password);

        if (accessToken)
            localStorage.setItem("accessToken", accessToken);

        reset();

    };

    /*
    const [formData, setFormData] = useState<FormData>({
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
       
        await login(formData.email, formData.password);

        if (accessToken)
            localStorage.setItem("accessToken", accessToken);

    };
    */

    return (
        <>
            <div className="flex min-h-full flex-col justify-center">
                
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h1 id="title" className="text-2xl">Login</h1>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        
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
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:text-gray-900 sm:text-sm sm:leading-6"
                                    {...register('password', { required: 'Passwort ist erforderlich', minLength: { value: 8, message: 'Mindestens 8 Zeichen' } })}
                                />
                            </div>
                            {errors.password && (<div className="mt-2 text-red-600">{errors.password.message}</div>)}
                        </div>

                        {/* Submit */}
                        <div>
                            <button type="submit" id="login" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Login</button>
                        </div>

                    </form>
                </div>

            </div>
        </>
    )
};

export { Login };