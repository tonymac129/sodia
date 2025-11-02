import { motion } from "framer-motion";

function Modal({ setShown }) {
  return (
    <motion.div
      className="modal-bg"
      onClick={(e) => {
        if (e.target === e.currentTarget) setShown(false);
      }}
    >
      <div className="modal">
        <h2 className="modal-title">Link copied!</h2>
        <p className="modal-description">Share this post's link with other people to enjoy the fun together!</p>
        <button className="modal-close" onClick={() => setShown(false)}>
          Close
        </button>
      </div>
    </motion.div>
  );
}

export default Modal;
