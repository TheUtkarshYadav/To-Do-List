import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const Auth = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const [error, setError] = useState(null);
    const [isLogIn, setIsLogIn] = useState(true);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);

    const viewLogIn = (status) => {
        setIsLogIn(status);
        setError(null);
    }

    const handleSubmit = async (event, endPoint) => {
        event.preventDefault();
        if (!isLogIn && password !== confirmPassword) {
            setError("Make sure the passwords match!");
            return;
        }

        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/${endPoint}`,
            { email, password }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = response.data;
        if (data.detail) {
            setError(data.detail);
        } else {
            setCookie("Email", data.email);
            setCookie("AuthToken", data.token);

            window.location.reload();
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-container-box">
                <form>
                    <h2>{isLogIn ? "Please Log in" : "Please Sign up!"}</h2>
                    <input
                        type="email"
                        placeholder="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isLogIn && <input
                        type="password"
                        placeholder="confirm password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />}
                    <input
                        type="submit"
                        className="create"
                        onClick={(e) => handleSubmit(e, isLogIn ? "login" : "signup")}
                    />
                    {error && <p>{error}</p>}
                </form>

                <div className="auth-options">
                    <button
                        onClick={() => viewLogIn(false)}
                        style={{ backgroundColor: !isLogIn ? "rgb(255, 255, 255)" : "rgb(188, 188, 188)" }}
                    >Sign Up</button>
                    <button
                        onClick={() => viewLogIn(true)}
                        style={{ backgroundColor: isLogIn ? "rgb(255, 255, 255)" : "rgb(188, 188, 188)" }}
                    >Log in</button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
