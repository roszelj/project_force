import styled from 'styled-components/macro';

export const TextButton = styled.button`
  background: ${p => p.theme.backgroundVariant};
  outline: none;
  height: 40px;
  padding: 0;
  margin: 0;
  border: none;
  color: ${p => p.theme.primary};
  cursor: pointer;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }

  &:active {
    opacity: 0.4;
  }
`;
