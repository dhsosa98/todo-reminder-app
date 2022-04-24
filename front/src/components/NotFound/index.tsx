import { FC } from "react";
import styled from "styled-components";

interface NotFoundProps {
  title: string;
}

const NotFound: FC<NotFoundProps> = ({ title }) => {
  return (
    <StyledCard>
      <StyledParagraph>Not found any {title}</StyledParagraph>
      <StyledParagraph>Add one with button below</StyledParagraph>
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
`;

const StyledParagraph = styled.p`
  color: #818181;
`;
