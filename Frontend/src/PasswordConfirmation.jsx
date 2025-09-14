import { useState } from "react";
import img from "./assets/images/bulk.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PasswordInput from "./PasswordInput";

function PasswordConfirmation(props) {
  const navigate = useNavigate();
  const location = useLocation();

  // username passed from Signup page
  const eusername = location.state?.username;

  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pass) => {
    return pass.length >= 6 && /\d/.test(pass);
  };

  function handlePassword(evt) {
    setPassword(evt.target.value);
    setError("");
  }

  function handleConfirmPassword(evt) {
    setCpassword(evt.target.value);
    setError("");
  }

  async function handleSubmit() {
    if (!password || !cpassword) {
      setError("⚠️ Both fields are required!");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters and include a number.");
      return;
    }

    if (password !== cpassword) {
      setError("⚠️ Passwords do not match!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Save user to local storage
      const storedUsers = JSON.parse(localStorage.getItem('netflixUsers') || '[]');
      const newUser = {
        username: eusername,
        password: password,
        createdAt: new Date().toISOString()
      };

      storedUsers.push(newUser);
      localStorage.setItem('netflixUsers', JSON.stringify(storedUsers));

      // Clear temporary session data
      sessionStorage.removeItem('tempUser');

      // Navigate to Login
      navigate("/");
    } catch (error) {
      setError("⚠️ An error occurred while creating your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <img className="w-screen h-screen object-cover absolute inset-0" src={img} alt="background" />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative flex-1 flex flex-col">
        <header className="relative">
          <div className="relative mx-4 md:ml-14 py-4">
            <svg
              className="relative w-12 h-12 md:w-16 md:h-16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20 4H4C2.897 4 2 4.897 2 6v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 5.006-8-5.006V6h16zm-16 12V9.489l8 5.006 8-5.006V18H4z" />
            </svg>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="relative bg-black/60 backdrop-blur-md w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-white/10 text-center p-6 md:p-8">
            <h1 className="font-bold text-2xl md:text-4xl font-sans text-white mb-4">
              Create Password
            </h1>
            <p className="text-white/80 text-sm md:text-base mb-6">
              Just one more step to finish creating your account
            </p>

            <div className="space-y-4 text-left">
              <PasswordInput
                value={password}
                onChange={handlePassword}
                placeholder="Password"
                error={!!error}
              />

              <PasswordInput
                value={cpassword}
                onChange={handleConfirmPassword}
                placeholder="Confirm Password"
                error={!!error}
              />

              {/* Password Checklist */}
              <div className="text-xs md:text-sm text-white/80 space-y-1">
                <p className={`${password.length >= 6 ? 'text-green-400' : 'text-white/70'}`}>• At least 6 characters</p>
                <p className={`${/\d/.test(password) ? 'text-green-400' : 'text-white/70'}`}>• Contains at least one number</p>
                <p className={`${password && password === cpassword ? 'text-green-400' : 'text-white/70'}`}>• Passwords match</p>
              </div>

              {error && <p className="text-red-500 font-bold">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-lg text-white text-lg font-semibold disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
              >
                {loading ? "Creating Account..." : "Finish Sign Up"}
              </button>

              <p className="mt-6 text-white text-sm">
                Already have an account?{" "}
                <Link to={"/"} className="text-purple-500 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

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
  );
}

export default PasswordConfirmation;
