import React, { useState, useContext } from "react";

import { Form, Button } from "semantic-ui-react";

const Auth = () => {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onChangeInput = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const changeMode = () => {
    setIsSignup(!isSignup);
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div style={{ width: "30%", margin: "auto" }}>
      <h2 style={{ margin: "0 40%" }}>{isSignup ? "Signup" : "Login"}</h2>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <Form.Input
          label="Email"
          placeholder="Email.."
          name="email"
          value={formValue.email}
          onChange={onChangeInput}
          error={errors.email}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          value={formValue.password}
          onChange={onChangeInput}
          error={errors.password}
          type="password"
        />
        <Button.Group style={{ float: "right" }}>
          <Button
            type="button"
            color="red"
            disabled={loading}
            onClick={changeMode}
          >
            {isSignup ? "Switch to Login" : "Switch to Signup"}
          </Button>
          <Button.Or />
          <Button type="submit" inverted color="green" disabled={loading}>
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
      {/* {errors.general && errors.general.length > 1 && (
        <div className="ui error message">{errors.general}</div>
      )} */}
    </div>
  );
};
export default Auth;
