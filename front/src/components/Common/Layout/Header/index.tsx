import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { LOGOUT } from "../../../../features/authSlice";
import { StyledBackButton } from "../../Styled-components";



const Header: FC<any> = ({children}) => {
    // const [isOpen, setIsOpen] = useState(false);

    // const openHamburgerMenu = () => {
    //     setIsOpen((isOpen: boolean)=>!isOpen);
    // };

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(-1);
    };

  const handleClose = () => {
    dispatch(LOGOUT())
  };
    // const navItems = [
    //     // <NavLink
    //     //   to="/"
    //     // >
    //     // {({ isActive }) => (
    //     //   <span>Home</span>
    //     //   )}
    //     // </NavLink>,
    //     <NavLink
    //       onClick={openHamburgerMenu}
    //       to="/directories"
    //     >
    //       {({ isActive }) => (
    //       <span>Directories</span>
    //       )}
    //     </NavLink>,
    //   ];
    return (
        <StyledHeader>
            {/* <StyledButton onClick={openHamburgerMenu}>🈯</StyledButton>
            <div>
            {navItems.map((item, index) => (
                <div key={index}>
                {item}
                </div>
            ))} */}
            <StyledCloseButton onClick={handleClose}>Logout</StyledCloseButton>
            <i className="fi fi-rr-user"></i>
            <i className="fi fi-rs-bell"></i>
            {/* <StyledBackButton onClick={handleNavigate}>Back</StyledBackButton> */}

            {/* </div> */}
        </StyledHeader>
    )
}

export default Header;

const PersonIcon = styled.i`
    border-radius: 50%;
    border: 1px solid #ccc;
`;


const StyledCloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.8rem;
    color: #3d53c5;
    border-radius: 5px;
    border: none;
`;
const StyledHeader = styled.header`
    position: sticky;
    display: flex;
    top: 0;
    z-index: 100;
    align-items: center;
    flex-direction: row-reverse;
    background-color: white;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 75px;
    gap: 2rem;
`

const StyledButton = styled.button`
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
    color: #5290c2;
    border-radius: 5px;
    padding: 10px 20px;
    display: block;
    @media (min-width: 768px){
        display: none;
    }
    `

