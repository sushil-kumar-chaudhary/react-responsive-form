import React from 'react';
import './App.css';
const inputs = [
  {
    type: 'Phone',
    regex: /^\d+$/,
    length: 10
  },
  {
    type: 'Email',
    regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  {
    type: 'Name',
    regex: /^[a-z ,.'-]+$/i
  }
];

class LoginForm extends React.Component {
  constructor () {
    super();
    this.state = {
      selectedOption: 'Email',
      name: '',
      searchBy: '',
      errors: '',
      ispost: '',
      validate: false
    };
    this.radioChange = this.radioChange.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.searchByChange = this.searchByChange.bind(this);
    this.validate = this.validate.bind(this);
    this.postApi = this.postApi.bind(this);
  }

  radioChange (e) {
    e.preventDefault();
    this.setState({
      selectedOption: e.currentTarget.value
    });
  }

  nameChange (e) {
    e.preventDefault();
    this.setState({
      name: e.currentTarget.value
    });
  }

  searchByChange (e) {
    e.preventDefault();
    this.setState({
      searchBy: e.currentTarget.value
    });
  }

  validate () {
    const errors = {};
    const { name, searchBy, selectedOption } = this.state;
    const data = inputs.filter(item => item.type === selectedOption);
    let regex = '';
    if (data) { regex = data[0].regex; }
    console.log(this.state, 1, regex);
    if (!searchBy || !regex.test(searchBy) || (data[0].length && (searchBy.length !== data[0].length))) {
      errors[selectedOption] = true;
    }
    const data1 = inputs.filter(item => item.type === 'Name');
    if (data) { regex = data1[0].regex; }
    if (!name || (!regex.test(name)) || (data1[0].length && (name.length !== data1[0].length))) {
      errors.name = true;
    }

    return errors;
  }

  postApi (event) {
    event.preventDefault();
    const errors = this.validate();
    const { name, searchBy, selectedOption } = this.state;
    this.setState({ errors: errors });

    if (Object.keys(errors).length < 1) {
      console.log('22', this.state);
      this.setState({ ispost: false });
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, [selectedOption]: searchBy })
      };
      fetch('https://jsonplaceholder.typicode.com/posts', requestOptions)
        .then(response => response.json())
        .then(data => { alert('posted') });
  }
}

  render () {
    const options = ['Email', 'Phone'];
    return (
      <form id="loginform" onSubmit={this.postApi}>
        <FormHeader title="Sample Form" />
        <div>
          <FormInput className={this.state.errors.name ? 'error' : ''} description="Name" placeholder="Enter  Name" type="text" onChange={this.nameChange}/>

          <div style={{
            color: 'rgba(187,187,187,0.9)',
            paddingTop: '2rem',
            textAlign: 'left',
            paddingLeft: '4.5rem',
            paddingBottom: '0.5rem'
          }} >Search By</div>
          <div style={{ display: 'flex', color: 'black', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            {options.map((option, key) => {
              return <div>
                <input type="radio"
                  value={option}
                  checked={this.state.selectedOption === option}
                  onChange={this.radioChange}
                  key={key}
                  name='option'
                  required/>
                {option}
              </div>;
            })}

          </div>

          <FormInput className={this.state.errors[this.state.selectedOption] ? 'error' : ''} description={this.state.selectedOption} placeholder={'Enter ' + this.state.selectedOption} type={this.state.selectedOption === 'Email' ? 'email' : 'text'} onChange={this.searchByChange}/>

          <FormButton title="Search" onClick={this.postApi}/>
        </div>

      </form>
    );
  }
}

const FormHeader = props => (
  <h2 id="headerTitle">{props.title}</h2>
);

const FormButton = props => (
  <div id="button" className="row">
    <button type="submit">{props.title}</button>
  </div>
);

const FormInput = props => (
  <div className="row">
    <label>{props.description}</label>
    <input className={props.className} type={props.type} placeholder={props.placeholder} onChange={props.onChange}/>
  </div>
);

function App () {
  return (
    <div className="App">
      <header >
        <LoginForm/>
      </header>
    </div>
  );
}

export default App;
