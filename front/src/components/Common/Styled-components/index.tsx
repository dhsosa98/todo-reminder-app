import styled from "styled-components";

export const StyledAddButton = styled.button`
  background-color: #5290c2;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  color: white;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  @media (max-width: 768px) {
    padding: 5px 10px;
  }
  &:hover {
    background-color: #106cb8;
    }
`;

export const StyledInput = styled.input`
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
  outline-color: #3a60b7;
  @media (min-width: 768px) {
    height: 40px;
  }
`;

export const StyledErrorParagraph = styled.p`
  color: red;
  text-align: center;
  font-size: 12px;
`;

export const StyledH1 = styled.h1`
  color: white;
  text-align: center;
`;
export const StyledH2 = styled.h2`
  color: white;
  text-align: center;
`;

export const StyledH3 = styled.h3`
  color: #3a60b7;
  text-align: center;
`;

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 0.8rem;
  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const StyledWrapperSection = styled.div`
  background-color: white;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 20px;
  max-width: 300px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledBackButton = styled.button`
  background-color: #c3c2c0;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  color: white;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  @media (max-width: 768px) {
    padding: 5px 10px;
  }
  &:hover {
    background-color: #808080;
    }
`;

export const StyledEditButton = styled.button`
  background-color: #5290c2;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  color: white;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 10px;
  border: none;
  cursor: pointer;
  @media (max-width: 768px) {
    padding: 5px 10px;
  }
  &:hover {
    background-color: #106cb8;
    }
`;

export const StyledDeleteButton = styled.button`
  background-color: red;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  color: white;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 10px;
  border: none;
  cursor: pointer;
  grid-area: 2 / 3 / 3 / 4;
  @media (max-width: 768px) {
    padding: 5px 10px;
  }
  &:hover {
    background-color: #860000;
    }
`;
