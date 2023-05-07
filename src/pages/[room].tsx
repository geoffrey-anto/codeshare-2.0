import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Editor from "@monaco-editor/react";
import Head from "next/head";

export default function Home() {
  const [code, setCode] = useState("");
  const [socketIO, setSocketIO] = useState<Socket | null>(null);
  const { room } = useRouter().query;

  const socketInitializer = () => {
    const socket = io(
      process.env.NEXT_PUBLIC_WS_URL
        ? process.env.NEXT_PUBLIC_WS_URL
        : "http://localhost:3001"
    );
    setSocketIO(socket);
    socket.on("connect", async () => {
      console.log("connected");
      socket.on("code-receive", (code) => {
        setCode(code);
      });
      socket.emit("room-code", room);
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  };

  const getInitialCode = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/code/${room}`);
    const data = await res.json();
    setCode(data.code);
    console.log(data);
  };

  useEffect(() => {
    if (!window || !room) return;

    socketInitializer();

    getInitialCode();
  }, [room]);

  const handleCodeChange = (value: string | undefined) => {
    if (!value) {
      setCode("");

      if (socketIO) {
        socketIO.emit("code-send", {
          roomCode: room,
          data: "",
        });
      }
      return;
    }

    setCode(value);

    if (socketIO) {
      socketIO.emit("code-send", {
        roomCode: room,
        data: value,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Code Editor - {room}</title>
      </Head>
      <main
        className={
          "flex min-h-screen flex-col items-center justify-between bg-slate-700"
        }
      >
        <div
          className={
            "flex flex-col h-[20vh] items-center text-white gap-2 justify-center"
          }
        >
          <h1 className={"text-3xl font-semibold"}>Code Editor</h1>
          <h2 className={"text-lg font-semibold"}>{room}</h2>
        </div>
        <div className="w-[90vw]">
          <Editor
            className="border-2 border-gray-400 rounded-md"
            height="80vh"
            defaultLanguage="text"
            defaultValue={code}
            onChange={handleCodeChange}
            value={code}
          />
        </div>
      </main>
    </>
  );
}
