import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import "./register.css"

function Register() {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const [err, setErr] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  async function registerUser(user) {
    try {
      const res = await axios.post("http://localhost:8000/user-api/user", user)
      if (res.data.message === "User created") {
        navigate("/login")
      } else {
        setErr(res.data.message)
      }
    } catch (error) {
      setErr("Something went wrong. Try again.")
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="register-page">
      <div className="register-overlay"></div>
      <div className="register-container">
        <div className="register-card">
          <div className="card-content">
            <div className="register-header">
              <h1 className="register-title">Create Account</h1>
            </div>

            <form onSubmit={handleSubmit(registerUser)} className="register-form">
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div className="input-container">
                  <div className="input-border"></div>
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    {...register("username", { required: true })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-container">
                  <div className="input-border"></div>
                  <MdEmail className="input-icon" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", { required: true })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-container">
                  <div className="input-border"></div>
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    {...register("password", { required: true })}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="register-btn">
                <div className="btn-border"></div>
                <div className="btn-content">
                  <span>Create Account</span>
                </div>
              </button>

              {err && (
                <div className="error-container">
                  <div className="error-border"></div>
                  <p className="error-text">{err}</p>
                </div>
              )}
            </form>

            <div className="register-footer">
              <p>
                Already have an account?{" "}
                <a href="/login" className="login-link">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
