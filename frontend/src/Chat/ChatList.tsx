import * as React from "react";
import "./styles.css";
import { Link } from "react-router-dom";


export function ChatList() {
    const [name, setName] = React.useState<string>("");
    return (
        <>
            <div className="Chat">
                <p>Enter your name and Move on to a chat room.</p>
                <p>
                    name:
                    <label>
                        <input
                            name="name"
                            type="text"
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    </label>
                </p>
                <ul>
                    <li>
                        <Link to="/chat" state={{ room: 'room1', name: name }}>Move to Chat room 1</Link>
                    </li>
                    <li>
                        <Link to="/chat" state={{ room: 'room2', name: name }}>Move to Chat room 2</Link>

                    </li>
                </ul>
            </div>
        </>
    );
}
