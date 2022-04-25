import { FC } from "react";
import styled from "styled-components";

interface NotFoundProps {
  title: string;
  text?: string;
}

const NotFound: FC<NotFoundProps> = ({ title, text }) => {
  return (
    <StyledCard>
      <StyledParagraph>Not found any {title}</StyledParagraph>
      <StyledParagraph>{text}</StyledParagraph>
    </StyledCard>
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
