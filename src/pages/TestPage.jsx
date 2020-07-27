import React from 'react';
import { connect } from 'react-redux';

const TestPage = () => {
  return (
    <div className="test-page">
      <h1>Test Page</h1>
    </div>
  )
}

const mapStateToProp = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProp, mapDispatchToProps)(TestPage);
