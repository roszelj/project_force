/**
 *
 * StringAvatar
 *
 */
import * as React from 'react';

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  if (typeof string !== 'undefined' && string !== '') {
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  }
  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function StringAvatar(name: string, size: string) {
  let _size: any = {};
  let _fontSize: any = {};

  if (size === 'small') {
    _size = { width: 24, height: 24 };
    _fontSize = '0.7rem';
  } else {
    _size = { width: 40, height: 40 };
    _fontSize = '1.25rem';
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
      width: _size,
      fontSize: _fontSize,
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}
