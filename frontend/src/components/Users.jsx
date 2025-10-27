import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";

export const Users = ({ onSendMoney }) => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const timerId = setTimeout(() => {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/bulk?filter=${filter}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            .then(response => {
                setUsers(response.data.users);
            })
            .catch(error => {
                console.error("Failed to fetch users:", error);
                setUsers([]);
            });
        }, 300);

        return () => {
            clearTimeout(timerId);
        };
    }, [filter]);

    return (
        <>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>
            <div className="my-2">
                <input 
                    onChange={(e) => setFilter(e.target.value)} 
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full px-2 py-1 border rounded border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <div>
                {users.map(user => <User key={user._id} user={user} onSendMoney={onSendMoney} />)}
            </div>
        </>
    );
};

Users.propTypes = {
    onSendMoney: PropTypes.func.isRequired
};

function User({ user, onSendMoney }) {
    return (
        <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center items-center mr-3">
                    <div className="text-xl">
                        {user.firstName[0].toUpperCase()}
                    </div>
                </div>
                <div>
                    <div>
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>
            <div>
                <Button 
                    onClick={() => onSendMoney(user)} 
                    label={"Send Money"} 
                />
            </div>
        </div>
    );
}

User.propTypes = {
    user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired
    }).isRequired,
    onSendMoney: PropTypes.func.isRequired
};