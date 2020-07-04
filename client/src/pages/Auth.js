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
    setLoading(true);
    e.preventDefault();
  };

  return (
    <div style={{ width: "30%", margin: "auto" }}>
      <h2>{isSignup ? "Signup" : "Login"}</h2>
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
        <Button
          style={{ float: "right" }}
          type="submit"
          inverted
          color="green"
          disabled={loading}
          loading={loading}
        >
          {isSignup ? "Signup" : "Login"}
        </Button>
      </Form>
      <Button inverted color="red" onClick={changeMode}>
        {isSignup ? "Switch to Login" : "Switch to Signup"}
      </Button>
      {/* {errors.general && errors.general.length > 1 && (
        <div className="ui error message">{errors.general}</div>
      )} */}
    </div>
  );
};
export default Auth;
