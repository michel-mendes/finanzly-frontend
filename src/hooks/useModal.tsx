import { useState } from "react";

function useModal() {
    const [isOpen, setIsOpen] = useState(false);

    function showModal() {
        setIsOpen(true)
    }
    
    function closeModal() {
        setIsOpen(false)
    }

    return { isOpen, showModal, closeModal }
}

export { useModal }