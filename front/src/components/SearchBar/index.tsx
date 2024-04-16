import styled from "styled-components";
import { StyledWrapperSection } from "../Common/Styled-components";
import { FC, useRef } from "react";
import { useDispatch } from "react-redux";
import { selectSearch, setSearch } from "../../features/searchSlice";
import { useSelector } from "react-redux";

type SearchBarProps = {
    search?: string;
    handleSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const WrapperSearchSection = styled(StyledWrapperSection)`
    display: flex;
    width: 100%;
    background-color: transparent;
`;

const SearchBar: FC<SearchBarProps> = () => {
  const dispatch = useDispatch();
  const { search } = useSelector(selectSearch);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
  }
  const containerRef = useRef<HTMLDivElement>(null);
    return (
        <>
          <StyledSearchContainer
          ref={containerRef}
          >
            <StyledInputSearch
              onFocus={() => containerRef.current?.classList.add('focused')}
              onBlur={() => containerRef.current?.classList.remove('focused')}
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
            />
            <i className="fi fi-rr-search"></i>          
          </StyledSearchContainer>
        </>
    )
}   

export default SearchBar;

const StyledSearchContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
  align-items: center;
  margin: 0px 2em;
  &.focused {
    border-color: #3d53c5;
  }
  @media (max-width: 768px) {
    margin: 0px 1em;
    font-size: 0.8rem;
    width: 170px;
  };
`;

const StyledInputSearch = styled.input`
  border: none;
  border-radius: 5px;
  width: 100%;
  padding: 5px;
  outline: none;
  font-size: 1rem;
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 3px;
  }
`;
