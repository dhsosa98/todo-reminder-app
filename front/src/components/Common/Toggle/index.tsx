import { FC, SyntheticEvent } from "react";
import { ITodoItem } from "../../../interfaces/TodoItem/ITodoItem";
import styled from "styled-components";

interface ToggleProps {
  item: ITodoItem;
  handleChange: (e: SyntheticEvent<HTMLInputElement>) => void;
  isDisabled: boolean;
}

const Toggle: FC<ToggleProps> = ({ item, handleChange, isDisabled }) => {
  return (
    <CheckBoxWrapper>
      <CheckBox
        id={"imput-selected-" + item?.id}
        disabled={isDisabled}
        type="checkbox"
        name="selected"
        onChange={handleChange}
        checked={item?.selected}
      />
      <CheckBoxLabel htmlFor={"imput-selected-" + item?.id} />
    </CheckBoxWrapper>
  );
};

export default Toggle;

const CheckBoxWrapper = styled.div`
  position: relative;
  grid-area: 2 / 1 / 3 / 2;
`;
const CheckBoxLabel = styled.label`
  position: absolute;
  top: 5px;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
  @media (max-width: 768px) {
    top: 3px;
  }
`;
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  margin: 0;
  &:checked + ${CheckBoxLabel} {
    background: #3d53c5;
    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
  &:disabled + ${CheckBoxLabel} {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;
