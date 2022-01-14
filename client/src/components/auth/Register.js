import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';
import Alert from '../../components/layouts/Alert';
import axios from 'axios';

// Connect we use to connect to redux,
// 1. calling a action
// 2. getting a state

// We brought in connect and action
// Now use connect in export to connect component and redux
// connect(redux)(component)
// connect(stateToMapToRedux, action)
// after connection, action is available in props to set the state values by set methods

//const Register = (props) =>  we destructured props and used it as setAlert inside register
const Register = ({ setAlert }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // to use onchange for all fields of form we have changed , name: e.target.value => [e.target.name]:[e.target.value]

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      // console.log('Passwords do not match');
      //pass payload to action alert
      setAlert('Passwords do not match', 'danger');
    } else {
      console.log(formData);

      /* to make calls by nirmal way (axios) to just test the bcakend
      const newUser = {
        name,
        email,
        password,
      };

      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        };
        const body = JSON.stringify(newUser);
        const res = await axios.post('/api/users', body, config);
        console.log(res.data);
        
      } catch (err) {
        console.error(err.response.data);
      }*/
    }
  };

  return (
    <Fragment>
      <div className='container'>
        <Alert />
        <h1 className='large text-primary'>Sign Up</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Create Your Account
        </p>
        <form className='form' onSubmit={(e) => onSubmit(e)}>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Name'
              name='name'
              value={name}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              value={email}
              onChange={(e) => onChange(e)}
              required
            />
            <small className='form-text'>
              This site uses Gravatar so if you want a profile image, use a
              Gravatar email
            </small>
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              value={password}
              onChange={(e) => onChange(e)}
              minLength='6'
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Confirm Password'
              name='password2'
              value={password2}
              onChange={(e) => onChange(e)}
              minLength='6'
            />
          </div>
          <input type='submit' className='btn btn-primary' value='Register' />
        </form>
        <p className='my-1'>
          Already have an account? <Link to='/login'>Sign In</Link>
        </p>
      </div>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired, //ptfr es7 snippet prop type is req
};

// export default Register;
export default connect(null, { setAlert })(Register);
// connect (state, {actions} ) {actions} ie secont argument allows to access the props.action
//whenever we use connect from redux we need to export it as well

//connect we use to connect to redux,
// 1. calling a action
// 2. getting a state
