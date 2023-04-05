import styled from 'styled-components/macro';

export const A = styled.a`
  color: ${p => p.theme.primary};
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
    opacity: 0.8;
  }

  &:active {
    opacity: 0.4;
  }
`;
