import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listProjects } from './graphql/queries';
import { createProject as createProjectMutation ,deleteProject as deleteProjectMutation , createTask as createTaskMutation ,deleteTask as deleteTaskMutation , } from './graphql/mutations';
import TaskPanel from './components/taskPanel';
const initialFormState = { name: ''}
const initialTaskFormState = { name: '', description: '', projectID: ''}
function App() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [taskFormData, setTaskFormData] = useState(initialTaskFormState);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const apiData = await API.graphql({ query: listProjects });
    console.log(apiData);
    setProjects(apiData.data.listProjects.items);
  }
  
  async function createProject() {
    if (!formData.name) return;
    await API.graphql({ query: createProjectMutation, variables: { input: formData } });
    fetchProjects();
    setFormData(initialFormState);
  }
  async function createTask() {
    if (!taskFormData.name) return;
    await API.graphql({ query: createTaskMutation, variables: { input: taskFormData } });
    fetchProjects();
    setFormData(initialTaskFormState);
  }


  return (
    <div className="App">
      <h1>My Projects App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Project name"
        value={formData.name}
      />
      <button onClick={createProject}>Create Project</button>
      <div style={{marginBottom: 30}}>
        {
          projects.map((project,i) => (
            <div key={project.id || project.name}>
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              {project.tasks.items.map(task => (
                <div>
                  <TaskPanel key = {i} task = {task}/>
                </div>
              ))}
              <div> 
                {taskFormData['projectID'] = console.log(project.id)}
                <input
                  onChange={e => setTaskFormData({ ...taskFormData, 'name': e.target.value})}
                  placeholder="Task Name"
                  value={taskFormData.name}
                  />
                <input
                  onChange={e => setTaskFormData({ ...taskFormData, 'description': e.target.value})}
                  placeholder="Task Description"
                  value={taskFormData.description}
                />
                  <button onClick={createTask}>Create Task</button>
              </div>
            </div>

          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);