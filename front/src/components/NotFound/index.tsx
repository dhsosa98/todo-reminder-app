import { FC } from "react";
import styled from "styled-components";
import { StyledH1 } from "../Common/Styled-components";

interface NotFoundProps {
  title: string;
  text?: string;
  children?: any;
}

const NotFound: FC<NotFoundProps> = ({ title, text, children }) => {
  return (
    <>
    <StyledCard>
      <StyledParagraph>Not found any {title}</StyledParagraph>
      <StyledParagraph>{text}</StyledParagraph>
      {children}
    </StyledCard>
    </>
  );
};

export default NotFound;

const StyledCard = styled.div`
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  margin: 10px;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
`;

const StyledParagraph = styled.p`
  color: #818181;
`;
