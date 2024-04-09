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
  text-align: center;
`;

const StyledParagraph = styled.p`
  color: #818181;
`;
