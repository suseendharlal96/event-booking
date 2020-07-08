import React, { useState, useContext } from "react";

import { Form, Button } from "semantic-ui-react";

import { AuthContext } from "../context/authcontext";

const Auth = (props) => {
  const { setToken, setUserId, setEmail } = useContext(AuthContext);
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);

  const onChangeInput = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const changeMode = () => {
    setIsSignup(!isSignup);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formValue.email);
    const email = formValue.email;
    const password = formValue.password;
    if (email.trim() === "") {
      console.log(1);
      // setLoading(false);
      setErrors({ ...errors, email: "Must not be empty" });
    } else {
      console.log(1);
      // setLoading(false);
      const regEx = /^([0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-w]*[0-9a-zA-Z].)+[a-zA-Z]{2,9})$/;
      if (!email.match(regEx)) {
        errors.email = "Please enter a valid email";
      }
    }
    if (password.trim() === "") {
      console.log(1);
      // setLoading(false);
      setErrors({ ...errors, password: "Must not be empty" });
    }
    if (errors.email === "" && errors.password === "") {
      let reqBody;
      if (isSignup) {
        reqBody = {
          query: `mutation{
        createUser(userInput: {email:"${formValue.email}",password:"${formValue.password}"}){
          _id
          email
        }
      }`,
        };
      }
      if (!isSignup) {
        reqBody = {
          query: `
          query{
            login(email:"${email}",password:"${password}"){
              email
              userId
              token
            }
          }`,
        };
      }
      fetch("http://localhost:4000/graphql", {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status !== 200 && res.status !== 201) {
            console.log(res);
            setLoading(false);
            throw new Error("Failed!");
          }
          return res.json();
        })
        .then((res) => {
          setLoading(false);
          console.log(res);
          if (res.data) {
            if (res.data.login) {
              setToken(res.data.login.token);
              setUserId(res.data.login.userId);
              setEmail(res.data.login.email);
            }
            if (res.data.createUser) {
              setUserId(res.data.createUser._id);
              setEmail(res.data.createUser.email);
            }
            props.history.push("/events");
          }
          if (res.errors) {
            setErrors({ ...errors, general: res.errors[0].message });
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };

  return (
    <div style={{ width: "30%", margin: "auto" }}>
      <h2 style={{ margin: "0 40%" }}>{isSignup ? "Signup" : "Login"}</h2>
      <Form onSubmit={onSubmit} noValidate>
        <Form.Input
          icon="user"
          loading={loading}
          label="Email"
          autoFocus
          placeholder="Email.."
          name="email"
          value={formValue.email}
          onChange={onChangeInput}
          error={errors.email && errors.email.length > 0 ? errors.email : null}
        />
        <Form.Input
          label="Password"
          icon="user"
          placeholder="Password.."
          name="password"
          loading={loading}
          value={formValue.password}
          onChange={onChangeInput}
          error={
            errors.password && errors.password.length > 0
              ? errors.password
              : null
          }
          type="password"
        />
        <Button.Group>
          <Button
            disabled={loading}
            type="button"
            color="red"
            onClick={changeMode}
          >
            {`Switch to ${isSignup ? "Login" : "Signup"}`}
          </Button>
          <Button.Or />
          <Button disabled={loading} type="submit" inverted color="green">
            {isSignup
              ? loading
                ? "Signing up.."
                : "Signup"
              : loading
              ? "Logging in.."
              : "Login"}
          </Button>
        </Button.Group>
      </Form>
      {errors.general && errors.general.length > 1 && (
        <div className="ui error message">{errors.general}</div>
      )}
    </div>
  );
};
export default Auth;
