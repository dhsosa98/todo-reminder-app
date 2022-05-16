import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { LOGOUT } from "../../../../features/authSlice";



const Header: FC<any> = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);

    const openHamburgerMenu = () => {
        setIsOpen((isOpen: boolean)=>!isOpen);
    };

    const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(LOGOUT())
  };
    const navItems = [
        // <NavLink
        //   to="/"
        // >
        // {({ isActive }) => (
        //   <span>Home</span>
        //   )}
        // </NavLink>,
        <NavLink
          onClick={openHamburgerMenu}
          to="/directories"
        >
          {({ isActive }) => (
          <span>Directories</span>
          )}
        </NavLink>,
      ];
    return (
        <StyledHeader>
            {/* <StyledButton onClick={openHamburgerMenu}>🈯</StyledButton>
            <div>
            {navItems.map((item, index) => (
                <div key={index}>
                {item}
                </div>
            ))} */}
            <StyledCloseButton onClick={handleClose}>Close Session</StyledCloseButton>

            {/* </div> */}
        </StyledHeader>
    )
}

export default Header;


const StyledCloseButton = styled.button`
    position: absolute;
    background: none;
    border: none;
    cursor: pointer;
    border: 1px solid #5290c2;
    padding: 8px 10px;
    font-size: 0.8rem;
    margin: 10px;
    color: #5290c2;
    &:hover {
        background-color: #5290c2;
        color: white;
    }
    @media (min-width: 768px) {
        font-size: 1rem;
    }
`;
const StyledHeader = styled.header`
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    background-color: white;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 75px;
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

