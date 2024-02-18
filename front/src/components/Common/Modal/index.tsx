
import React from 'react';
import ReactDOM from 'react-dom';

export interface ModalProps {
  children: React.ReactNode;
}


const Modal: React.FC<ModalProps> = ({ children }) => {

    return ReactDOM.createPortal(
        <div>
            {children}
        </div>,
        document.getElementById('modal-root') as HTMLElement
    );
}

export default Modal;