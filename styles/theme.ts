const darkColors = {
  // Main Colors
  primary: '#8721B7',
  primary_dark: '#66138C',

  green: '#4C8320',
  red: '#AC0C0A',

  // Background Colors
  bg_0: '#131313',
  bg_1: '#181818',
  bg_2: '#212121',
  bg_3: '#292929',

  // Text Colors
  text: '#FFFFFF',
  text_gray_1: 'dddddd',
  text_gray_2: '9e9e9e',
  text_inverse: '000000',
  text_button: 'f3f3f3',
};

const lightColors = {
  ...darkColors,

  bg_3: '#fbfbfb',
  bg_2: '#f7f7f7',
  bg_1: '#edeced',
  bg_0: '#c1bec1',

  text: '#000000',
  text_gray_1: '#555555',
  text_gray_2: '#a3a3a3',
  text_inverse: '#ffffff',
};

const colors = { dark: darkColors, light: lightColors };

export default colors;
