// Login.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginThunk, resetState } from '../../redux/slice/userslice';
import './Login.css';

function Login() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isPending, loginUserStatus, errMsg } = useSelector(state => state.userLogin);

  useEffect(() => {
    if (loginUserStatus) {
      navigate('/');
    }
  }, [loginUserStatus, navigate]);

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  function onSubmit(userCreds) {
    dispatch(userLoginThunk(userCreds));
  }

   return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Container className="login-container">
          <h2 className="login-title">Login</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Username"
                {...register("username", { required: true })}
                className="login-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                {...register("password", { required: true })}
                className="login-input"
              />
            </Form.Group>

            <Button type="submit" className="login-button" disabled={isPending}>
              {isPending ? <Spinner size="sm" animation="border" /> : 'Login'}
            </Button>

            {errMsg && <p className="login-error mt-3 text-center">{errMsg}</p>}
          </Form>
        </Container>
      </div>
    </div>
  );
}

export default Login;
