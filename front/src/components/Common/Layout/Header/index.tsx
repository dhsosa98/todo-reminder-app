import { FC, forwardRef, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { LOGOUT } from "../../../../features/authSlice";
import { StyledBackButton } from "../../Styled-components";
import { getNotifications, markAsRead } from "../../../../services/notifications";
import { IUserNotification } from "../../../../interfaces/User/IUserNotification";
import useSearch from "../../../../hooks/useSearch";
import SearchBar from "../../../SearchBar";
import bellIcon from '/bell.svg';

const NotificationBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: red;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 9px;
`;

const NotificationIconWrapper = styled.div`
  position: relative;
  &:hover {
    cursor: pointer;
  }
`;


const Notification = forwardRef(({ readNotificationsAmount, children, isShowBadge, onClick }: any, ref: any) => (
    <NotificationIconWrapper ref={ref} onClick={onClick}>
      <Icon src={bellIcon} className="fi fi-rs-bell"></Icon>
      {readNotificationsAmount > 0 && isShowBadge && (
        <NotificationBadge>
         {readNotificationsAmount>9 ? '9+' : readNotificationsAmount}
        </NotificationBadge>
      )}
      {children}
    </NotificationIconWrapper>
));


const Header: FC<any> = ({children}) => {
    // const [isOpen, setIsOpen] = useState(false);

    // const openHamburgerMenu = () => {
    //     setIsOpen((isOpen: boolean)=>!isOpen);
    // };

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { search, updateSearch } = useSearch();


    const handleNavigate = () => {
        navigate(-1);
    };

  const handleClose = () => {
    dispatch(LOGOUT())
  };
  const [isOpened, setIsOpened] = useState(false);

  const [notifications, setNotifications] = useState<IUserNotification[]>([]);

  const menuRef = useRef(null);

  const notificationRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;
    document.body.style.overflow = isOpened ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpened]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      event.stopPropagation();
      if (notificationRef.current && (notificationRef.current as any).contains(event.target)) {
        return;
      }
      if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
        setIsOpened(false);
      }
    }
  
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, notificationRef]);

  const fetchNotifications = async () => {
    const response = await getNotifications();
    setNotifications(response.data);
  };

  useEffect(() => {
    fetchNotifications();
  },[])

  const readNotifications = notifications.filter((notification) => notification.read === false);

  const onToggleMenu = async (event: any) => {
    event.stopPropagation();
    setIsOpened(!isOpened);
    setTimeout(async () => {
        await markAsRead(readNotifications.map((notification) => notification.id));
    }, 1000);
  }

    const [isOpenedFirstTime, setIsOpenedFirstTime] = useState(false);

    useEffect(() => {
      if (!isOpenedFirstTime && isOpened) {
        setIsOpenedFirstTime(true);
      }
    }, [isOpenedFirstTime, isOpened]);



    let readNotificationsAmount = readNotifications.length;

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
            {/* <i className="fi fi-rr-user"></i> */}
        <NotificationContainer>
        <Notification ref={notificationRef} readNotificationsAmount={readNotificationsAmount} isShowBadge={!isOpenedFirstTime} onClick={onToggleMenu} />
        {isOpened && (
          <Menu ref={menuRef}>
            <h3>Notifications</h3>
            {notifications.map((notification) => {
                return (
                    <MenuItem notification={notification} key={notification.id} />
                )
            })}
          </Menu>
        )}
        </NotificationContainer>
        
        <SearchBar search={search} handleSearch={(e) => updateSearch(e.target.value)} />
            {/* <StyledBackButton onClick={handleNavigate}>Back</StyledBackButton> */}

            {/* </div> */}
        </StyledHeader>
    )
}

export default Header;


const MenuItem = ({notification}: any) => {
    const sendText = new Date(notification.sentAt).toLocaleString('en-US', {
        weekday: 'short', // represents the day of the week like "Tue"
        day: '2-digit', // represents the day of the month as two digits
        month: 'short', // represents the month in three-letter format
        year: 'numeric', // represents the year as four digits
        hour: '2-digit', // represents the hour
        minute: '2-digit', // represents the minute
      });
    const [showBadge, setShowBadge] = useState(!notification.read);

    const onMouseEnter = () => {
        setTimeout(() => {
            setShowBadge(false);
        }, 200)
    }

    return (
        <MenuItemLi key={notification.id} onMouseEnter={onMouseEnter} read={notification.read} >
          <div>
              <p>
              <span>{notification.notification.title + notification.notification.body}</span>
              {showBadge && <NewBadge>New</NewBadge>}
              </p>
              <h6>{sendText}</h6>
          </div>
        </MenuItemLi>
    )
}

const NotificationContainer = styled.div`
  @media (min-width: 768px) {
    position: relative;
  }
`;

const NewBadge = styled.span`
  background-color: #3d53c5;
  color: white;
  display: 'inline-block';
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 10px;
  margin-left: 8px;
`;

const Icon = styled.img`
    cursor: pointer;
    width: 22px;
    height: 22px;
    &:hover {
      background-color: #f5f5f5;
      border-radius: 50%;
    }
    @media (min-width: 768px) {
      position: relative;
    }
`;

const MenuItemLi = styled.li<{read: boolean}>`
  cursor: pointer;
  display: flex;
  gap: 6px;
  padding: 8px 0px;
  background-color: ${(props) => (props.read ? 'white' : '#f5f5f5')};
  & p, h6 {
    margin: 0;
  }
`;

const MenuItemDelete = styled(MenuItem)`
  &:hover {
    color: red;
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: absolute;
  border: 1px solid #ccc;
  background-color: white;
  z-index: 100;
  top: 22px;
  font-size: 0.8rem;
  padding: 10px;
  border-radius: 5px;
  width: 400px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  list-style: none;
  left: -380px;
  max-height: 500px;
  overflow-y: auto;
  & li:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
  animation: appear 0.5s ease-in-out;
  @media (max-width: 768px) {
    left: 0;
    right: 0;
    top: 62px;
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    max-height: auto;
  }
  @keyframes appear {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    } 
  }
`;

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
    margin-right: 10px;
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
    gap: 1rem;
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

