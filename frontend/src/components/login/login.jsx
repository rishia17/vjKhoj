import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { userLoginThunk, resetState } from "../../redux/slice/userslice"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa"
import "./login.css"

function Login() {
  const { register, handleSubmit } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isPending, loginUserStatus, errMsg } = useSelector((state) => state.userLogin)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (loginUserStatus) {
      navigate("/")
    }
  }, [loginUserStatus, navigate])

  useEffect(() => {
    dispatch(resetState())
  }, [dispatch])

  function onSubmit(userCreds) {
    dispatch(userLoginThunk(userCreds))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="login-page">
      <div className="login-overlay"></div>
      <div className="login-container">
        <div className="login-card">
          <div className="card-border"></div>
          <div className="card-glow"></div>
          <div className="card-content">
            <div className="login-header">
              <h1 className="login-title">Welcome Back</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
              <div className="input-group">
                <label className="input-label">Username</label>
                <div className="input-container">
                  <div className="input-border"></div>
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    placeholder="Enter your username"
                    {...register("username", { required: true })}
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
                    placeholder="Enter your password"
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

              <button type="submit" disabled={isPending} className="login-btn">
                <div className="btn-border"></div>
                <div className="btn-content">
                  {isPending ? (
                    <>
                      <AiOutlineLoading3Quarters className="loading-spinner" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </div>
              </button>

              {errMsg && (
                <div className="error-container">
                  <div className="error-border"></div>
                  <p className="error-text">{errMsg}</p>
                </div>
              )}
            </form>

            <div className="login-footer">
              <p>
                Don't have an account?{" "}
                <a href="/register" className="register-link">
                  Create one
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
