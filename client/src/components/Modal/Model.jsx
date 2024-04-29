import React from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Modal } from "flowbite-react";
import { Button } from "flowbite-react";
export default function Model({ title, showModal, setShowModal, handleClick }) {
  return (
    <>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3>{title}</h3>
            <div className="flex justify-between mt-7 gap-4">
              <Button color={"failure"} onClick={handleClick()}>
                Yes, I'm sure
              </Button>
              <Button
                color={"gray"}
                onClick={() => {
                  setShowModal(false);
                }}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
