import { FC } from "react";
import styled from "styled-components";

const Loader: FC = () => {
  return (
    <div>
      <StyledLoader></StyledLoader>
    </div>
  );
};

export default Loader;

const StyledLoader = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #737373;
  margin-bottom: 1rem;
  width: 40px;
  height: 40px;
  border: 10px solid #f3f3f3;
  border-top: 10px solid #737373;
  border-radius: 50%;
  animation: spinner 1s linear infinite;
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
