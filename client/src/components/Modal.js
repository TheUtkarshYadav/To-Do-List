import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const Modal = ({ mode, setShowModal, getData, task }) => {
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const editMode = mode === "edit" ? true : false;

    const [data, setData] = useState({
        user_email: editMode ? task.user_email : cookies.Email,
        title: editMode ? task.title : null,
        progress: editMode ? task.progress : 0,
        date: editMode ? task.date : new Date()
    });

    const postData = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/todos`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                console.log("It worked!");
                setShowModal(false);
                getData();
            }
        } catch (err) {
            console.error(err);
        }
    }

    const editData = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/todos/${task.id}`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                setShowModal(false);
                getData();
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData((prevData) => {
            return {
                ...prevData,
                [name]: value
            }
        });
    }

    return (
        <div className="overlay">
            <div className="modal">
                <div className="form-title-container">
                    <h3>Let's {mode} your task</h3>
                    <button onClick={() => setShowModal(false)}>X</button>
                </div>

                <form>
                    <input
                        required
                        maxLength={30}
                        placeholder="Please enter your task here"
                        name="title"
                        value={data.title}
                        onChange={handleChange}
                    />
                    <br />

                    {/* the below for means that the label is for anything with id=range */}
                    <label htmlFor="range">Drag to select your current progress</label>

                    <input
                        required
                        type="range"
                        id="range"
                        min="0"
                        max="100"
                        name="progress"
                        value={data.progress}
                        onChange={handleChange}
                    />
                    <input className={mode} type="submit" onClick={editMode ? editData : postData} />
                </form>
            </div>
        </div>
    );
}

export default Modal;
