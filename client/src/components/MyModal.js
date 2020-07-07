import React, { useState, useContext } from "react";

import { Modal, Button, Form } from "semantic-ui-react";

import { AuthContext } from "../context/authcontext";

const MyModal = (props) => {
  const { token } = useContext(AuthContext);
  const [post, setPost] = useState({
    title: "",
    description: "",
    price: "",
    date: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    price: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  const onChangeInput = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const submit = () => {
    setLoading(true);
    console.log(post);
    console.log(errors);
    if (post && post.price === "") {
      console.log(1);
      setErrors({ ...errors, price: "Must be greater than 0" });
    } else {
      console.log(1);
      setErrors({ ...errors, price: "" });
    }
    if (new Date(post.date).getTime() - new Date().getTime() < 0) {
      setErrors({ ...errors, date: "Date expired" });
    } else {
      setErrors({ ...errors, date: "" });
    }

    const reqBody = {
      query: `mutation{
        createEvent(eventInput: {title:"${post.title}",description:"${post.description}",price:${post.price},date:"${post.date}"}){
         title
         description
         price
         date
         creator{
             _id
             email
         }
        }
      }`,
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          setLoading(false);
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((res) => {
        setLoading(false);
        console.log(res);
        if (res.data) {
          props.submit(res.data);
          props.close();
        }
        if (res.errors) {
          setErrors({ ...errors, general: res.errors[0].message });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  return (
    <Modal size="small" open={props.open} onClose={props.close}>
      <Modal.Header>Post an Event!</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Form.Input
              name="title"
              error={errors && errors.title ? errors.title : null}
              value={post.title}
              placeholder="Title.."
              onChange={onChangeInput}
            />
            <Form.Input
              name="date"
              error={errors && errors.date ? errors.date : null}
              value={post.date}
              type="datetime-local"
              placeholder="Date.."
              onChange={onChangeInput}
            />
            <Form.Input
              name="price"
              error={errors && errors.price ? errors.price : null}
              type="number"
              value={post.price}
              placeholder="Price.."
              onChange={onChangeInput}
            />
            <Form.TextArea
              name="description"
              error={errors && errors.description ? errors.description : null}
              value={post.description}
              placeholder="Description.."
              onChange={onChangeInput}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={props.close}
          negative
          icon="cancel"
          content="Cancel"
          disabled={loading}
          labelPosition="right"
        />
        <Button
          onClick={submit}
          loading={loading}
          positive
          icon="checkmark"
          labelPosition="right"
          content="Submit"
        />
      </Modal.Actions>
    </Modal>
  );
};
export default MyModal;
