import React from 'react';
import PropTypes from 'prop-types';
import NoServer from '../common/noServer/noServer';

const NoPlayer = ({ notSupportedMessage }) => (
  <NoServer
    notSupportedMessage={notSupportedMessage}
  />
);

NoPlayer.propTypes = {
  notSupportedMessage: PropTypes.bool,
};

NoPlayer.defaultProps = {
  notSupportedMessage: false,
};

export default NoPlayer;
