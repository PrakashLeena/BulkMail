import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput";

console.log('🚀 Login component loading...');

function Login(props) {
  console.log('🎯 Login function called', props);

  const [eusername, setEusername] = useState("");
  const [epassword, setEpassword] = useState("");
  const [ruser, setRuser] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  console.log('📝 Login state initialized');

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (pass) => {
    return pass.length >= 6 && /\d/.test(pass);
  };

  function handleUIput(evt) {
    setEusername(evt.target.value);
    setError("");
    setRuser(true);
  }

  function handlePIput(evt) {
    setEpassword(evt.target.value);
    setError("");
  }

  async function checkUser() {
    // --- Step 1: check empty fields ---
    if (!eusername || !epassword) {
      setError("All fields are required!");
      return;
    }

    // --- Step 2: validate email ---
    if (!validateEmail(eusername)) {
      setError("Please enter a valid email address.");
      return;
    }

    // --- Step 3: validate password ---
    if (!validatePassword(epassword)) {
      setError("Password must be at least 6 characters and include a number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // --- Step 4: check with local storage ---
      const storedUsers = JSON.parse(localStorage.getItem('netflixUsers') || '[]');
      const user = storedUsers.find(u => u.username === eusername && u.password === epassword);

      if (user) {
        // --- Step 5: success ---
        console.log("Login successful");
        // Persist simple auth flag for route protection
        localStorage.setItem('authUser', eusername);
        navigate("/Landing", { state: { user: eusername } });
      } else {
        setError("⚠️ Invalid username or password! Please signup first.");
        setRuser(false);
      }
    } catch (error) {
      setError("⚠️ An error occurred during login.");
    } finally {
      setLoading(false);
    }
  }

  console.log('🎨 Login about to return JSX');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600">
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Debug message */}
      <div style={{position: 'fixed', top: '10px', left: '10px', background: 'red', color: 'white', padding: '5px', zIndex: 9999}}>
        🔍 LOGIN COMPONENT RENDERED
      </div>

      {/* Page Content */}
      <div className="relative flex flex-col flex-1">
        <header className="relative">
          <div className="relative mx-4 md:ml-14 py-4 md:py-6">
            <svg
              className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20 4H4C2.897 4 2 4.897 2 6v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 5.006-8-5.006V6h16zm-16 12V9.489l8 5.006 8-5.006V18H4z" />
            </svg>
          </div>
        </header>

        {/* Main Grid: Info (left) and Sign In (right) */}
        <div className="flex-1 px-4 sm:px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start max-w-6xl mx-auto">
            {/* Left Info Panel */}
            <div className="text-white/90 order-2 md:order-1 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight drop-shadow mb-3 md:mb-4">Welcome back to BulkMail</h2>
              <p className="text-white/80 text-sm sm:text-base md:text-lg">Send professional emails to multiple recipients effortlessly. Sign in to continue where you left off.</p>
              <ul className="mt-5 md:mt-6 space-y-2 md:space-y-3 text-white/85">
                <li className="flex items-start gap-3"><span className="mt-1">✅</span><span>Upload CSV or Excel lists and send in one click</span></li>
                <li className="flex items-start gap-3"><span className="mt-1">✅</span><span>Track recipients count and progress</span></li>
                <li className="flex items-start gap-3"><span className="mt-1">✅</span><span>Secure sign-in and data handling</span></li>
              </ul>
            </div>

            {/* Sign In Card */}
            <div className="order-1 md:order-2">
              <div className="relative bg-black/60 backdrop-blur-md w-full max-w-md md:ml-auto rounded-2xl shadow-2xl border border-white/10 text-center p-5 sm:p-6 md:p-8">
                <h1 className="font-bold text-xl sm:text-2xl md:text-4xl font-sans text-white mb-4 md:mb-6">
                  Sign In
                </h1>
                {!ruser && (
                  <p className="text-red-700 font-bold mb-4">
                    Please Signup before you Login!
                  </p>
                )}

                <div className="space-y-4 text-left">
                  <input
                    required
                    value={eusername}
                    onChange={handleUIput}
                    className={`p-3 sm:p-4 rounded-lg w-full text-sm sm:text-base bg-transparent border-2 text-white transition-all duration-200
                    ${error ? "border-red-500" : "border-white/30"} 
                    focus:border-white focus:ring-4 focus:ring-white/20 outline-none placeholder:text-white/70`}
                    type="email"
                    placeholder="Email"
                  />

                  <PasswordInput
                    required
                    value={epassword}
                    onChange={handlePIput}
                    placeholder="Password"
                    error={!!error}
                  />

                  {error && <p className="text-red-600 font-bold text-sm">{error}</p>}

                  <button
                    onClick={checkUser}
                    disabled={loading}
                    className="w-full py-3 rounded-lg text-white font-semibold disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl
                    bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>

                  <p className="text-center text-sm sm:text-base md:text-lg text-white/80">OR</p>
                  <button className="bg-white/10 w-full py-3 rounded-lg text-white hover:bg-white/20 transition-colors">
                    Use a Sign-In code
                  </button>
                  <p className="text-white/90 underline cursor-pointer hover:text-white text-sm sm:text-base">Forgot password?</p>

                  <div className="flex items-center justify-center mt-4">
                    <input className="w-4 h-4 mr-2 accent-purple-600" type="checkbox" id="remember" />
                    <label htmlFor="remember" className="text-white text-xs sm:text-sm select-none">Remember me</label>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1 mt-4">
                    <p className="text-white/30 text-xs sm:text-sm">New to BulkMail</p>
                    <p className="text-white text-xs sm:text-sm hover:underline">
                      <Link to={"/Signup"}>Sign up now.</Link>
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-white text-[10px] sm:text-xs px-2 sm:px-4">
                      This page is protected by Google reCAPTCHA to ensure you're not
                      a bot.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#161616] mt-auto">
        <div className="p-6 md:p-20">
          <p className="text-[#BABABA] py-3 text-sm">Questions? Contact us.</p>
          <div className="grid grid-cols-2 md:flex text-[#BABABA] justify-between underline gap-4 text-xs sm:text-sm md:text-base">
            <p>FAQ</p>
            <p>Help Center</p>
            <p>Terms of Use</p>
            <p>Privacy</p>
          </div>

          <div className="grid grid-cols-1 md:flex text-[#BABABA] mt-5 md:gap-64 underline gap-4 text-xs sm:text-sm md:text-base">
            <p>Cookie Preference</p>
            <p>Corporate Information</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
