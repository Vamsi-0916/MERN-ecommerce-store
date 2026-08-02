import { useEffect, useMemo, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
    useDeleteUserMutation,
    useGetUsersQuery,
    useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import Message from "../../components/Message";
import AdminMenu from "./AdminMenu";

const UserList = () => {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();

    const [deleteUser] = useDeleteUserMutation();

    const [editableUserId, setEditableUserId] = useState(null);
    const [editableUserName, setEditableUserName] = useState("");
    const [editableUserEmail, setEditableUserEmail] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [updateUser] = useUpdateUserMutation();

    const filteredUsers = useMemo(() => {
        const searchValue = searchTerm.trim().toLowerCase();

        if (!searchValue) return users || [];

        return (users || []).filter((user) => {
            const role = user.isAdmin ? "admin" : "user";

            return (
                user._id?.toLowerCase().includes(searchValue) ||
                user.username?.toLowerCase().includes(searchValue) ||
                user.email?.toLowerCase().includes(searchValue) ||
                role.includes(searchValue)
            );
        });
    }, [searchTerm, users]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure")) {
            try {
                await deleteUser(id);
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const toggleEdit = (id, username, email) => {
        setEditableUserId(id);
        setEditableUserName(username);
        setEditableUserEmail(email);
    };

    const updateHandler = async (id) => {
        try {
            await updateUser({
                userId: id,
                username: editableUserName,
                email: editableUserEmail,
            });
            setEditableUserId(null);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };


    return (
        <div className="p-4">
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <div className="flex flex-col md:flex-row">
                    <AdminMenu />
                    <div className="w-full md:w-4/5 mx-auto">
                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <h1 className="text-xl font-bold">
                                All Users ({filteredUsers.length})
                            </h1>
                            <input
                                type="text"
                                placeholder="Search users"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border px-3 py-2 text-black md:w-[20rem]"
                            />
                        </div>

                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">NAME</th>
                                    <th className="px-4 py-2 text-left">EMAIL</th>
                                    <th className="px-4 py-2 text-left">ADMIN</th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-6 text-center text-gray-400" colSpan="5">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td className="px-4 py-2">{user._id}</td>
                                            <td className="px-4 py-2">
                                                {editableUserId === user._id ? (
                                                    <div className="flex items-center">
                                                        <input
                                                            type="text"
                                                            value={editableUserName}
                                                            onChange={(e) => setEditableUserName(e.target.value)}
                                                            className="w-full p-2 border rounded-lg"
                                                        />
                                                        <button
                                                            onClick={() => updateHandler(user._id)}
                                                            className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center">
                                                        {user.username}{" "}
                                                        <button
                                                            onClick={() =>
                                                                toggleEdit(user._id, user.username, user.email)
                                                            }
                                                        >
                                                            <FaEdit className="ml-[1rem]" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                {editableUserId === user._id ? (
                                                    <div className="flex items-center">
                                                        <input
                                                            type="text"
                                                            value={editableUserEmail}
                                                            onChange={(e) => setEditableUserEmail(e.target.value)}
                                                            className="w-full p-2 border rounded-lg"
                                                        />
                                                        <button
                                                            onClick={() => updateHandler(user._id)}
                                                            className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <a href={`mailto:${user.email}`}>{user.email}</a>{" "}
                                                        <button
                                                            onClick={() =>
                                                                toggleEdit(user._id, user.username, user.email)
                                                            }
                                                        >
                                                            <FaEdit className="ml-[1rem]" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                {user.isAdmin ? (
                                                    <FaCheck style={{ color: "green" }} />
                                                ) : (
                                                    <FaTimes style={{ color: "red" }} />
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                {!user.isAdmin && (
                                                    <div className="flex">
                                                        <button
                                                            onClick={() => deleteHandler(user._id)}
                                                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserList;
