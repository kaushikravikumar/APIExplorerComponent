import React, { Component } from 'react';
import APIExplorerComponent from './APIExplorerComponent.js'
import './App.css';

class App extends Component {
  render() {
    return (
      <APIExplorerComponent
        title="Add new user"
        url="https://jsonplaceholder.typicode.com/users"
        method="POST"
        body = {[
          {
            name: 'email',
            type: 'email',
            max: 24,
            min: 3,
          },
          {
            name: 'full-name',
            type: 'text',
            placeholder: 'John Doe',
            required: true,
          },
          {
            name: 'phone',
            type: 'tel',
            pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}',
          },
        ]}
      ></APIExplorerComponent>
    );
  }
}

export default App;
