import { FC } from "react";
import styled from "styled-components";

interface NotFoundProps {
    title: string;
}

const NotFound: FC<NotFoundProps> = ({title}) => {
    return(
        <StyledCard>
        <StyledParagraph>Not found any {title}</StyledParagraph>
        <StyledParagraph>Add one with button below</StyledParagraph>
        </StyledCard>
    )
}

export default NotFound;

const StyledCard = styled.div`
    background-color: #fff;
    border-radius: 5px;
    padding: 20px;
    margin: 10px;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
    text-align: center;
    margin-bottom: 30px;
`;

const StyledParagraph = styled.p`
    color: #818181;
`;
