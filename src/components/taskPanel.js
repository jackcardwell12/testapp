import React, { Component } from 'react';

class TaskPanel extends Component {
    render() {
    const task = this.props.task
      return(
        <p>{this.props.task.name}</p>
      )
    }
  }
export default TaskPanel;