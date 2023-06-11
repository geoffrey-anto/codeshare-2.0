import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Editor from "@monaco-editor/react";
import Head from "next/head";
import { v4 as uuidv4 } from "uuid";
import { Pacifico } from "next/font/google";
import Dropdown from "~/components/Dropdown";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // url = localhost:3000/room
  const { room } = context.query;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/code/${room}`);
  const data = await res.json();

  const { code, language } = data;
  return {
    props: {
      codeInitial: code,
      languageInitial: language,
    },
  };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const robotFont = Pacifico({ weight: "400", subsets: ["latin-ext"] });

export default function Home({ codeInitial, languageInitial }: Props) {
  const [code, setCode] = useState("");
  const [socketIO, setSocketIO] = useState<Socket | null>(null);
  const { query, replace } = useRouter();
  const [userClientUUID, setUserClientUUID] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [editorCount, setEditorCount] = useState(-1);

  const { room } = query;

  const socketInitializer = () => {
    const socket = io(
      process.env.NEXT_PUBLIC_WS_URL
        ? process.env.NEXT_PUBLIC_WS_URL
        : "http://localhost:3001"
    );
    const uuid = uuidv4();
    setUserClientUUID(uuid);
    setSocketIO(socket);
    socket.on("connect", async () => {
      console.log("connected");
      socket.emit("room-code", room);
      socket.on("code-receive", (code) => {
        if (code.clientUUID === userClientUUID) return;
        setCode(code.data);
        setSelectedLanguage(code.codeLanguage);
        setEditorCount(code.roomUserCount);
      });
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  };

  useEffect(() => {
    if (!window || !room) return;

    socketInitializer();

    setCode(codeInitial);
    setSelectedLanguage(languageInitial);
  }, [room]);

  const handleCodeChange = (value: string | undefined) => {
    if (!value) {
      setCode("");

      if (socketIO) {
        socketIO.emit("code-send", {
          roomCode: room,
          data: "",
          clientUUID: userClientUUID,
          codeLanguage: selectedLanguage,
        });
      }
      return;
    }

    setCode(value);

    if (socketIO) {
      socketIO.emit("code-send", {
        roomCode: room,
        data: value,
        clientUUID: userClientUUID,
        codeLanguage: selectedLanguage,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Code Editor - {room}</title>
      </Head>
      <div
        className={
          "flex min-h-screen flex-col items-center justify-between bg-gray-950 " +
          robotFont.className
        }
      >
        <div
          className={
            "flex flex-col h-[20vh] items-center w-full text-white gap-2 justify-center pt-1"
          }
        >
          <h1 className={"text-4xl font-semibold gradient"}>Code Editor</h1>
          <h2 className={"text-lg font-semibold font-mono"}>{room}</h2>
          <div
            className={
              process.env.NEXT_PUBLIC_SHOW_HIDE_BUTTON === "true"
                ? "w-full flex flex-row items-center justify-between px-9"
                : "w-full flex flex-row items-center justify-end px-9"
            }
          >
            {process.env.NEXT_PUBLIC_SHOW_HIDE_BUTTON === "true" && (
              <button
                onClick={() => {
                  replace(process.env.NEXT_PUBLIC_HIDE_URL || "/");
                }}
                className="bg-black font-mono rounded-md px-4 py-2 font-semibold text-white"
              >
                Hide 🚫
              </button>
            )}
            <Dropdown
              languages={["javascript", "cpp", "python", "java", "go", "text"]}
              setSelectedLanguage={(l) => {
                setSelectedLanguage(l);
              }}
              selectedLanguage={selectedLanguage}
            />
          </div>
          <p className="absolute text-lg tracking-tighter top-6 right-6 font-mono">
            Editor Count: {editorCount != -1 ? editorCount : 0}
          </p>
        </div>
        <div className="w-full flex items-end justify-end"></div>
        <div className="w-[90vw]">
          <Editor
            className="rounded-md"
            height="80vh"
            language={selectedLanguage ? selectedLanguage : "text"}
            defaultValue={code}
            onChange={handleCodeChange}
            value={code}
            theme="vs-dark"
          />
        </div>
      </div>
    </>
  );
}
