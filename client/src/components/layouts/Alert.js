import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Connect we use to connect to redux,
// 1. calling a action
// 2. getting a state

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key='{alert.id}' className={` alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

//div key={alert.id} as we need a key whenever we map through a array for jsx

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);

// connect (state, action) here mapstatetoprops is default

/* 
Alert component is getting the state from the alert reducer, via maptostate 
ie
via connect(state, action)(comp)

we pass the const anynoymous function and no action, the function has the "alerts" field which will get the value from props
now the props will be available and we can get state in props.alerts, so we destructure it and return alert jsx


in mapStateToProps we are getting the state values to the props for this component
we define our local prop variable ie alerts 
and 
alerts: state.<name of state >

name of state is the same name of state defined in the root reducer 
where we combine all the reducers/states name



*/
