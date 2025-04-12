import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [err, setErr] = useState("");

  async function registerUser(user) {
    try {
      const res = await axios.post('http://localhost:5000/user-api/user', user);
      if (res.data.message === 'User created') {
        navigate('/login');
      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      setErr("Something went wrong. Try again.");
    }
  }

  return (
    <Container className="register-container">
      <h2 className="register-title">Register</h2>
      <Form onSubmit={handleSubmit(registerUser)}>
        <Form.Group className="mb-3">
          <Form.Control type="text" placeholder="Name" {...register("username", { required: true })} className="register-input" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control type="email" placeholder="Email" {...register("email", { required: true })} className="register-input" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control type="password" placeholder="Password" {...register("password", { required: true })} className="register-input" />
        </Form.Group>

        <Button type="submit" className="register-btn w-100">Register</Button>
        {err && <p className="register-error">{err}</p>}
      </Form>
    </Container>
  );
}

export default Register;
