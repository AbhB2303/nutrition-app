import React from 'react';
import logo from '../assets/IMG_2181.png';

console.log(logo); // /logo.84287d09.png

function Logo() {
  // Import result is the URL of your image
  return <img src={logo} alt="Logo" style={{ width: '50px' }} />;
}

export default Logo;