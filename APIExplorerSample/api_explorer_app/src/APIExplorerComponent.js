import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './APIExplorerComponent.css'

export default class APIExplorerComponent extends PureComponent {

  constructor(props) {
    super(props);

    const
    {
        title,
        url,
        method,
        body
    } = this.props;

    var kvpairs = [];

    body.map((obj, index) => (
      kvpairs.push({key: obj, value: ''})
    ));  

    this.state = {
      textfields: kvpairs,
      response: "{}"
    };

    this.handleChange = this.handleChange.bind(this); 
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  /**
   * [handleChange] is the callback function that's invoked to update the state with the 
   * new value for all of the textfields.
   */
  handleChange = (idx) => (evt) => {
    const newTextFieldValue = this.state.textfields.map((val, vidx) => {
      if (idx !== vidx) return val;
      return { ...val, value: evt.target.value };
    });
    
    this.setState({ textfields: newTextFieldValue, response: this.state.response});
  }

  /**
   * [checkRequiredFieldsFilled] returns whether all the required text fields are filled.
   */
  checkRequiredFieldsFilled()
  {
    var bool = true;
    var requiredFields = this.state.textfields.filter(obj => obj.key.required === true)
    
    requiredFields.forEach(function(element) {
      if(element.value === '')
      {
        alert('Error, please fill out all required body parameters.');
        bool = false;
      }
    });
    return bool;
  }

  /**
   * [processRequest] processes the request provided by user.
   */
  processRequest()
  {
    var jsonReqOptions;
    const proxy = 'https://cors-anywhere.herokuapp.com/'

    // Include body parameters for POST and PUT requests
    if(this.props.method === "POST" || this.props.method === "PUT")
    {
    jsonReqOptions = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: {
      }
    };
    this.state.textfields.map((obj, index) => (
      jsonReqOptions.body[obj.key.name] = obj.value
    ));
    }
    // Otherwise, no body parameters
    else{
      jsonReqOptions = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*"
        },
      };
    }

    jsonReqOptions.method = this.props.method

    fetch(proxy + this.props.url, jsonReqOptions)
    .then((response) => {
      return response.json();
    }).then((responseJson) => {
      this.setState({textfields: this.state.textfields, response: JSON.stringify(responseJson, null, '\t')})
      return responseJson;
    }).catch((error) => {
      alert(error);
    });
  }

  /**
   * [handleSubmit] is the onclick function invoked once the Send Request button is pressed.
   * @param {*} event event generated
   */
  handleSubmit(event) {
    event.preventDefault();

    if(this.checkRequiredFieldsFilled())
    {
      this.processRequest();
    }
  }

  /**
   * Determines whether a field is required and if so, returns (*) to show that.
   * @param {R} obj the textfield object.
   */
  requiredField(obj)
  {
    var str = "";
    if(obj.key.required === true)
    {
      str = "*";
    }
    return str;
  }

  /**
   * [createTextFields] initializes TextFields based on the body JSON input that's passed
   * into the APIExplorerComponent.
   */
  createTextFields = () => {
    if(this.props.method === "POST" || this.props.method === "PUT" )
    {
      return this.state.textfields.map((obj, index) => (
        (<label>
        {obj.key.name}
        {this.requiredField(obj)}
        <br/>
          <textarea value = {this.state.textfields[index].value} onChange={this.handleChange(index)} />
          <br/>
        </label>)
      ));
    }
    else{
      return (
        <p>No Body Parameters for {this.props.method} request</p>
      );
    }
  }

  render() {
    return (
      <div id ="container">
      <div>
      <h1> {this.props.title} </h1>
      <h3> {this.props.method} </h3>
      <div id="baseurltext"> Base URL: </div>
      <div id = "url"> {this.props.url} </div>
      </div>

      <div>
      <p id ="BodyText">Body</p>

      <form onSubmit={this.handleSubmit}>
      {this.createTextFields()}
      <input type="submit" value="Send Request" />
      </form>

      </div>

      <p id ="Response">
        Response
      </p>
      <pre id = "jsonres">
        {this.state.response}
      </pre>

      </div>
    );
  }
}

APIExplorerComponent.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  method: PropTypes.string,
  body: PropTypes.array
};