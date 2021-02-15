import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import waves from '../images/svg_2.png';
import './svgWaveContainer.scss';

export const Waves = ({ className }) => (
  <div className={classnames('playlist-waves-container', className)} style={{ backgroundImage: `url(${waves})` }} />
  /* <img src={waves} alt="sea change" />
  </div> */
);

Waves.propTypes = {
  className: PropTypes.string,
};

Waves.defaultProps = {
  className: undefined,
};
export default Waves;
