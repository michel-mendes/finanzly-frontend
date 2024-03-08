import { ReactNode, useEffect } from "react";

// Components
import { CustomButton } from "../CustomButton";

import styles from "./styles.module.css"

interface IModalProps {
  children?: ReactNode;
  modalTitle: string;
  isOpen: boolean;
  modalButtons: {
    okButton?: {
      onClick: () => void;
    },
    cancelButton?: {
      enabled?: boolean,
      onClick: () => void;
    },
    saveButton?: {
      enabled?: boolean;
      onClick: () => void;
    },
    yesButton?: {
      onClick: () => void;
    },
    noButton?: {
      onClick: () => void;
    },
    deleteButton?: {
      enabled?: boolean;
      onClick: () => void;
    }
  }
}

function ModalSaveCancel(props: IModalProps) {

  const { isOpen, modalTitle, children, modalButtons } = props

  const btnOk = !modalButtons.okButton ? null : <CustomButton caption="OK" handleClick={modalButtons.okButton.onClick} captionAlignment="center" />
  const btnCancel = !modalButtons.cancelButton ? null : <CustomButton handleClick={modalButtons.cancelButton.onClick} disabled={ (modalButtons.cancelButton.enabled !== undefined) ? !modalButtons.cancelButton.enabled : false } caption="Cancelar" captionAlignment="center" />
  const btnSave = !modalButtons.saveButton ? null : <CustomButton handleClick={modalButtons.saveButton.onClick} disabled={ (modalButtons.saveButton.enabled !== undefined) ? !modalButtons.saveButton.enabled : false } caption="Salvar" captionAlignment="center" />
  const btnYes = !modalButtons.yesButton ? null : <CustomButton handleClick={modalButtons.yesButton.onClick} caption="Sim" captionAlignment="center" />
  const btnNo = !modalButtons.noButton ? null : <CustomButton handleClick={modalButtons.noButton.onClick} caption="Não" captionAlignment="center" />
  const btnDelete = !modalButtons.deleteButton ? null : <CustomButton handleClick={modalButtons.deleteButton.onClick} disabled={!modalButtons.deleteButton.enabled} caption="Excluir" captionAlignment="center" />

  // Handle ESC key pressing
  const cancelModal = (modalButtons.cancelButton?.onClick || modalButtons.noButton?.onClick) || function () { }
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelModal()
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Remove the event when the modal is killed
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cancelModal]);
  // ------------------------------------------------------

  if (!isOpen) return null

  return (
    <>
      <div className={styles.modal_overlay}>
        <div className={styles.modal_box} onClick={(e) => { e.stopPropagation() }}>

          {/* Modal header */}
          <div className={styles.modal_header}>
            <span>
              {modalTitle}
            </span>
          </div>

          {/* Modal body */}
          <div className={styles.modal_body}>
            {children}
          </div>

          {/* Modal footer */}
          <div className={styles.modal_footer}>
            {btnDelete}
            {btnCancel}
            {btnNo}
            {btnYes}
            {btnOk}
            {btnSave}
          </div>

        </div>
      </div>
    </>
  )
}

export { ModalSaveCancel }