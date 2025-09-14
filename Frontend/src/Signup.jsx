import img from "./assets/images/bulk.png"
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";

function Signup(props) {
    const navigate = useNavigate()

    const [eusername, setEusername] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function handleUIput(evt) {
        setEusername(evt.target.value)
        setError("")
    }

    async function addUser() {
        if (!eusername) {
            setError("⚠️ Email is required!")
            return
        }

        if (!validateEmail(eusername)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true)
        setError("")

        try {
            // Check if user exists in local storage
            const storedUsers = JSON.parse(localStorage.getItem('netflixUsers') || '[]');
            const existingUser = storedUsers.find(u => u.username === eusername);

            if (existingUser) {
                setError("⚠️ User already exists! Please login instead.");
            } else {
                // Store user temporarily for password confirmation
                sessionStorage.setItem('tempUser', eusername);
                navigate("/PasswordConfirmation", { state: { username: eusername } });
            }
        } catch (error) {
            setError("⚠️ An error occurred during signup.");
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <img className="w-screen h-screen object-cover absolute inset-0" src={img} alt="background" />
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative flex-1 flex flex-col">
                <header className="relative">
                    <div className="relative mx-4 md:ml-14 flex justify-between items-center py-4">
                        <svg
                            className="relative w-12 h-12 md:w-16 md:h-16"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M20 4H4C2.897 4 2 4.897 2 6v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 5.006-8-5.006V6h16zm-16 12V9.489l8 5.006 8-5.006V18H4z" />
                        </svg>

                        <button><Link to={"/"} className="mr-4 md:mr-20 bg-[#8E3BEA] text-sm md:text-base font-semibold rounded-md px-3 md:px-5 py-2 text-white">Sign In</Link></button>
                    </div>
                </header>

                {/* Main Grid: Info (left) and Sign Up (right) */}
                <div className="flex-1 px-4 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
                        {/* Left Info Panel */}
                        <div className="text-white/90 order-2 md:order-1 text-center md:text-left">
                            <p className="font-extrabold text-3xl md:text-6xl font-sans text-white p-4 leading-tight drop-shadow-lg">
                                Welcome to BulkMail! Let’s Get Started<br />
                            </p>
                            <p className="text-white text-lg md:text-xl font-semibold mt-4">Grow Your Audience with BulkMail</p>
                            <p className="mt-6 md:mt-10 text-white/90 text-sm md:text-base font-semibold px-4">Ready to Supercharge Your Emails?</p>
                            <ul className="mt-6 space-y-3 text-white/85 px-4 md:px-0">
                                <li className="flex items-start gap-3 justify-center md:justify-start"><span className="mt-1">📑</span><span>Import email lists from CSV or Excel</span></li>
                                <li className="flex items-start gap-3 justify-center md:justify-start"><span className="mt-1">⚡</span><span>Send bulk emails with a single click</span></li>
                                <li className="flex items-start gap-3 justify-center md:justify-start"><span className="mt-1">🔒</span><span>Secure and privacy focused</span></li>
                            </ul>
                        </div>

                        {/* Sign Up Card */}
                        <div className="order-1 md:order-2">
                            <div className="relative bg-black/60 backdrop-blur-md w-full max-w-md md:ml-auto rounded-2xl shadow-2xl border border-white/10 text-center p-6 md:p-8">
                                <h2 className="font-bold text-2xl md:text-4xl font-sans text-white mb-4">Create your account</h2>
                                {error && <p className="text-red-500 font-bold mb-4 px-4">{error}</p>}
                                <div className="flex flex-col gap-3 mt-2">
                                    <input
                                        onChange={handleUIput}
                                        className="p-4 rounded-lg w-full text-base bg-black/50 border-2 border-white/20 text-white placeholder:text-white/70 outline-none transition-all duration-200 focus:border-white focus:ring-4 focus:ring-white/20"
                                        placeholder="Email address"
                                    />
                                    <button
                                        onClick={addUser}
                                        disabled={loading}
                                        className="w-full py-3 rounded-lg text-white text-lg font-semibold whitespace-nowrap disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                                    >
                                        {loading ? "Please wait..." : "Get Started"}
                                    </button>
                                    <p className="text-white/80 text-sm">Already have an account? <Link to={'/'} className="text-purple-400 hover:underline">Sign In</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-[#161616]">
                <div className="p-6 md:p-20">
                    <p className="text-[#BABABA] py-3">Questions? Contact us.</p>
                    <div className="grid grid-cols-2 md:flex text-[#BABABA] justify-between underline gap-4 text-sm md:text-base">
                        <p>FAQ</p>
                        <p>Help Center</p>
                        <p>Terms of Use</p>
                        <p>Privacy</p>
                    </div>

                    <div className="grid grid-cols-1 md:flex text-[#BABABA] mt-5 md:gap-64 underline gap-4 text-sm md:text-base">
                        <p>Cookie Preference</p>
                        <p>Corporate Information</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;
