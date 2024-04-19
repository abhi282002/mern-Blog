import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
export default function DashProfile() {
  const [formData, setFormData] = useState({});
  const { currentUser, dispatchError } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState("");
  const filePickerRef = useRef();
  const [uploadError, setUploadError] = useState("");
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
  const [updateUserSuccess, setUpdateUserSucess] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
    setImageFileUploading(true);
    setUploadError("");
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setUploadError("Could not upload image (File must be less than 2MB)");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploadProgress(null);
          setImageFileUploading(false);
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setUpdateUserSucess("");
          if (imageFileUploading) {
            setError("Please Wait for image to upload");
            return;
          }
          if (Object.keys(formData).length === 0) {
            setError("No Changes made");
            return;
          }

          try {
            dispatch(updateStart());

            const res = await fetch(`/api/user/update/${currentUser._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) {
              dispatch(updateFailure(data.message));
              setError(data.message);
            } else {
              dispatch(updateSuccess(data));
              setUpdateUserSucess("User's Profile Updated Successfully");
              setFormData("");
            }
          } catch (error) {
            setError(error.message);
            dispatch(updateFailure(error.message));
          }
        }}
        className="flex flex-col gap-4"
      >
        <input
          type="file"
          hidden
          accept="image/*"
          id=""
          ref={filePickerRef}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setImageFile(file);
            }
            setImageFileUrl(URL.createObjectURL(file));
          }}
        />
        <div
          className="w-32 h-32 relative self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => {
            filePickerRef.current.click();
          }}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgb(62, 152, 199, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full object-cover w-full h-full border-8  border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {uploadError && <Alert color={"failure"}>{uploadError}</Alert>}
        <TextInput
          type="text"
          id="username"
          placeholder={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder={currentUser.email}
          onChange={handleChange}
        />

        <TextInput
          type="password"
          id="password"
          placeholder="* * * * * * *"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone={"purpleToBlue"}>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span
          onClick={() => {
            setShowModal(true);
          }}
          className="cursor-pointer"
        >
          Delete Account
        </span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color={"success"} className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {(error || dispatchError) && (
        <Alert color="failure" className="mt-5">
          {error || dispatchError}
        </Alert>
      )}

      {showModal && (
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
              <h3>Are you sure you want to delete your account?</h3>
              <div className="flex justify-between mt-7 gap-4">
                <Button
                  color={"failure"}
                  onClick={async () => {
                    setShowModal(false);
                    try {
                      dispatch(deleteUserStart());
                      const res = await fetch(
                        `/api/user/delete/${currentUser._id}`,
                        {
                          method: "DELETE",
                        }
                      );
                      const data = await res.json();
                      if (!res.ok) {
                        dispatch(deleteUserFailure(data.message));
                      } else {
                        dispatch(deleteUserSuccess(data));
                      }
                    } catch (error) {
                      dispatch(deleteUserFailure(error.message));
                    }
                  }}
                >
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
      )}
    </div>
  );
}
