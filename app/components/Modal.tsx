interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  titleId?: string; // ID para el título del modal, si lo tiene
  descriptionId?: string; // ID para la descripción del modal, si lo tiene
}

const Modal: React.FC<ModalProps> = ({ onClose, children, titleId }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-label={titleId}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-3/4 max-w-lg p-6 animate-fade-in relative"
        tabIndex={-1}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
