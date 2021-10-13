import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Comment, Avatar, Form, Button, List, Input, message } from "antd";
import moment from "moment";
import axios from "axios";
import { API_URL } from "../config/constants.js";

const { TextArea } = Input;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? "replies" : "reply"}`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        댓글 달기
      </Button>
    </Form.Item>
  </>
);

// const deleteComment = (id2) => {
//     axios
//       .delete(`${API_URL}/product/${this.props.id}/reply/${id2}`, config)
//       .then((result) => {
//         message.info("삭제완료.");
//       })
//       .catch((error) => {
//         console.error(error);
//         message.error(`에러가 발생했습니다. ${error.message}`);
//       });
//   };

const config = {
    headers: { Authorization: localStorage.getItem("Authorization") },
  };

class App extends React.Component {
  state = {
    comments: this.props.comments,
    submitting: false,
    value: "",
  };

  
  postComments = () => {
    axios
      .post(
        `${API_URL}/product/${this.props.id}/reply`,
        {
          postId: this.props.id,
          userId: this.props.user.id,
          content:this.state.value,
        },
        config
      )
      .then((result) => {
        console.log("댓글달기완료!!");
        console.log(result);
      })
      .catch((error) => {
        console.log("댓글실패!!!!!")
        console.error(error);
      });
  }
  

  handleSubmit = () => {
    console.log(this.props)
    this.postComments()
    this.setState({
      submitting: true,
    });
    
    setTimeout(() => {
      
      this.setState({
        submitting: false,
        value: "",
        comments: [
          ...this.state.comments,
          {
            author: this.props.user.nickname,
            avatar: `${this.props.user.profileImageUrl === "/upload/public/avatar.png" ? `${API_URL}/upload/public/avatar.png` : this.props.user.profileImageUrl }`,
            content: <p>{this.state.value}{<Button onClick={() => this.props.deleteComment(this.id)}>삭제</Button>}</p>,
            datetime: moment().fromNow(),
          },
        ],
      });
    }, 1000);
  };

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

 

  render() {
    const { comments, submitting, value } = this.state;
    return (
      <>
        
        {comments.length > 0 && <CommentList comments={comments} />}
        <Comment
          
          avatar={
            <Avatar
              src= {this.props.user.profileImageUrl === "/upload/public/avatar.png" ? `${API_URL}/upload/public/avatar.png` : this.props.user.profileImageUrl }
              alt="Its Mine"
            />
          }
          content={
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
            />
          }
        />
      </>
    );
  }
}

export default App;
