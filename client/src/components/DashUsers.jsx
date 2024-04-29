import { Button, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Model from "./Modal/Model";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deletedUserId, setDeletedUserId] = useState(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getUsers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>

              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => {
              return (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      {user.isAdmin ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </Table.Cell>

                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setDeletedUserId(user._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
          {showMore && (
            <Button
              onClick={async () => {
                const startIndex = users.length;
                try {
                  const res = await fetch(
                    `/api/user/getUsers?startIndex=${startIndex}`
                  );
                  const data = await res.json();
                  if (res.ok) {
                    setUsers((prev) => [...prev, ...data.users]);
                    if (data.users.length < 9) {
                      setShowMore(false);
                    }
                  }
                } catch (error) {
                  console.log(error.message);
                }
              }}
            >
              Show More
            </Button>
          )}
        </>
      ) : (
        <p>you have no users yet</p>
      )}
      <Model
        title={"Are you sure you want to delete this User?"}
        showModal={showModal}
        setShowModal={setShowModal}
        handleClick={() => async () => {
          console.log("click");
          setShowModal(false);
          try {
            const res = await fetch(`/api/user/delete/${deletedUserId}`, {
              method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
              console.log(data.message);
            } else {
              setUsers((prev) =>
                prev.filter((user) => user._id !== deletedUserId)
              );
            }
          } catch (error) {
            console.log(error.message);
          }
        }}
      />
    </div>
  );
}
