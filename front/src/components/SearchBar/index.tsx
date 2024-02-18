import styled from "styled-components";
import { StyledWrapperSection } from "../Common/Styled-components";
import { FC } from "react";

type SearchBarProps = {
    search: string;
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const WrapperSearchSection = styled(StyledWrapperSection)`
    display: flex;
    width: 100%;
`;

const SearchBar: FC<SearchBarProps> = ({search, handleSearch}) => {
    return (
        <WrapperSearchSection>
          <StyledSearchContainer>
            <StyledInputSearch
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
            />
            <span>🔎</span>
          </StyledSearchContainer>
        </WrapperSearchSection>
    )
}   

export default SearchBar;

const StyledSearchContainer = styled.div`
  display: flex;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  align-items: center;
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
