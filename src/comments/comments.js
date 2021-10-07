import React, { createElement, useState, Component } from 'react';
import { Comment, Tooltip, Avatar, Input, Button } from 'antd';
import moment from 'moment';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';

const {TextArea} = Input;

const onChange = e => {
  console.log('Change:', e.target.value);
};

class Test extends Component {
  constructor() {
  super();
    this.state = {
      value: "",
      commentList: [],
    }
  }

  getValue = (event) => {
    this.setState({
        value: event.target.value,
    })	
  }

  addComment = () => {
  this.setState({
    commentList: this.state.commentList.concat([this.state.value]),
    value: "",
  })	
}

addCommEnter = (e) => {
  if(e.key === "Enter"){
    this.addComment();
  }
}
  render() {
    return (
        <div>
            <TextArea showCount maxLength={100} onChange={onChange} onKeyPress={this.addCommEnter} onChange={this.getValue} type="text"/>
                <Button onClick={this.addComment}>submit</Button>
                <ul>
                    
                    {this.state.commentList.map((comm, idx) => {
                    return <li key={idx}>{comm}</li>
                    })}
                </ul>
        </div>
    );
  }
}

export default Test;
