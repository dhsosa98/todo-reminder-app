import styled from "styled-components";
import { StyledWrapperSection } from "../Common/Styled-components";
import { FC, useRef } from "react";

type SearchBarProps = {
    search: string;
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const WrapperSearchSection = styled(StyledWrapperSection)`
    display: flex;
    width: 100%;
`;

const SearchBar: FC<SearchBarProps> = ({search, handleSearch}) => {
  const containerRef = useRef<HTMLDivElement>(null);
    return (
        <WrapperSearchSection>
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
        </WrapperSearchSection>
    )
}   

export default SearchBar;

const StyledSearchContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 5px;
  align-items: center;
  &.focused {
    border-color: #3d53c5;
  }
`;

const StyledInputSearch = styled.input`
  border: none;
  border-radius: 5px;
  padding: 5px;
  outline: none;
  font-size: 1.2rem;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;
