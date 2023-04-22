import { ReactNode, useEffect } from "react";
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
      onClick: () => void;
    },
    saveButton?: {
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

  const btnOk = !modalButtons.okButton ? null : <button onClick={modalButtons.okButton.onClick}>OK</button>
  const btnCancel = !modalButtons.cancelButton ? null : <button onClick={modalButtons.cancelButton.onClick}>Cancelar</button>
  const btnSave = !modalButtons.saveButton ? null : <button onClick={modalButtons.saveButton.onClick}>Salvar</button>
  const btnYes = !modalButtons.yesButton ? null : <button onClick={modalButtons.yesButton.onClick}>Sim</button>
  const btnNo = !modalButtons.noButton ? null : <button onClick={modalButtons.noButton.onClick}>Não</button>
  const btnDelete = !modalButtons.deleteButton ? null : <button onClick={modalButtons.deleteButton.onClick} disabled={!modalButtons.deleteButton.enabled}>Excluir</button>

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