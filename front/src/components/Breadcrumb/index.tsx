import React, { FC, useEffect, useState } from "react";
import { StyledH2 } from "../Common/Styled-components"
import useDirectory from "../../hooks/useDirectory";
import {directoryService} from '../../services/directories';
import { IDirectory } from "../../interfaces/Directory/IDirectory";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledButton = styled(Link)<{ $active?: boolean }>`
    background-color: transparent;
    color: ${({ $active }) => $active ? "black" : "#1f1c1cc4"};
    padding: 5px 10px;
    border-radius: 5px;
    margin: 0 5px;
    font-size: 1.2rem;
    cursor: pointer;
    border: none;
    text-decoration: none;
`;


const BreadCrumb = () => {

    const {currentDirectory} = useDirectory();

    const [directories, setDirectories] = useState<IDirectory[]>([]);

    const fetchBreadcrumb = async () => {
        const {data} = await directoryService.getBreadcrumbTree(currentDirectory?.id as number) as any;
        setDirectories(data);
    }

    useEffect(() => {
        if (!currentDirectory.id) {
            return;
        }
        fetchBreadcrumb();
    }, [currentDirectory.id]);

    if (!currentDirectory.id) {
        return null;
    }

    return (
    <BreadCrumbContainer>
        {
            directories?.map((directory: IDirectory, index: number) => {
                return (
                <React.Fragment key={directory.id}>
                {index===0 && <StyledButton to={`/directories`}>Home</StyledButton>}
                {"/"} 
                <StyledButton to={`/directories/${directory.id}`} $active={index+1 == directories.length}>{directory.name}</StyledButton>
                </React.Fragment>
                )
            })        
        }
    </BreadCrumbContainer>
    )
}

export default BreadCrumb;

const BreadCrumbContainer = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
`;
