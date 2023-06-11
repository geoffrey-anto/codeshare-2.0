import { Pacifico } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const robotFont = Pacifico({ weight: "400", subsets: ["latin-ext"] });

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  return (
    <>
      <Head>
        <title>Code Editor</title>
      </Head>
      <main
        className={
          "flex min-h-screen flex-col items-center justify-center p-24 bg-gray-950 text-white"
        }
      >
        <p
          className={
            "text-5xl font-semibold font-mono gradient " + robotFont.className
          }
        >
          Code Share 2.0
        </p>

        <p className="text-2xl font-semibold font-mono mt-10">
          A code editor for pair programming
        </p>

        <div className="flex flex-col gap-4 mt-8">
          <input
            type="text"
            placeholder="Enter room code"
            className="p-4 rounded-md bg-slate-700 text-white font-mono text-xl"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          {roomCode && (
            <Link href={`/${roomCode}`}>
              <p className="text-xl text-center font-semibold font-mono text-white gradient_bg p-4 rounded-md cursor-pointer">
                Create/Join
              </p>
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
