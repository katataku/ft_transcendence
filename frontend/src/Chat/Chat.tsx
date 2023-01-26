import * as React from "react";
import "./styles.css";
import io from 'socket.io-client';
import { useLocation } from "react-router-dom";

type messageEventType = {
    key: number;
    name: string;
    room: string;
    msg: string;
};

type State = {
    name: string;
    room: string;
};
// const ServerURL: string = "wss://ws.postman-echo.com/raw";
const ServerURL: string = "ws://localhost:3002";
export function Chat() {

    // const [room, setRoom] = React.useState<string>("");
    // const [name, setName] = React.useState<string>("");
    const [message, setMessage] = React.useState<string>("");
    const [itemList, setItemList] = React.useState<JSX.Element[]>([]);

    // eslint-disable-next-line 
    const [socket, _setSocket] = React.useState(io(ServerURL));

    const location = useLocation();
    const { room, name }: State = location.state;

    const makeItem = (item: messageEventType): JSX.Element => {
        const outerClassName: string = (name === item.name) ? "line__right" : "line__left";
        const innerClassName: string = (name === item.name) ? "line__right-text" : "line__left-text";

        return (
            <div className={outerClassName} key={item.key}>
                <div className={innerClassName}>
                    <div className="name">{item.name}</div>
                    <div className="text">{item.msg}</div>
                </div>
            </div>
        );
    }

    socket.on("connect", () => {
        console.log('socket connected.');
    });

    socket.on("message", (data: string) => {
        console.log('message received:' + data);
        try {
            const item: messageEventType = JSON.parse(data);
            if (item.room === room) {
                setItemList([...itemList, makeItem(item)]);
            }
        } catch (error) {
            console.log('message parse error.');
        }
    });

    let clickSendMessage = (msg: string): void => {
        console.log("clicked");

        const obj: messageEventType = {
            key: Date.now(),
            name,
            room,
            msg
        };
        const sendMsg: string = JSON.stringify(obj);
        socket.emit("message", sendMsg);
        console.log("message sent:" + sendMsg);
        setMessage('');
    };


    return (
        <>
            <div className="Chat">
                <h1>Chat Page</h1>
                <p>user name: {name}</p>
                <p>room: {room}</p>
                <div className="line__container">
                    <div className="line__contents">{itemList}</div>
                </div>
                <label>
                    Message:
                    <input
                        name="message"
                        value={message}
                        type="text"
                        onChange={(e) => {
                            setMessage(e.target.value);
                        }}
                    />
                </label>
                <button
                    onClick={() => {
                        if (message) return clickSendMessage(message);
                    }}
                >
                    send
                </button>
            </div>

        </>
    );
}
