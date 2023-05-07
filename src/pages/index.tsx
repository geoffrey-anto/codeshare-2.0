import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!window) return;

    window.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        if (roomCode) {
          router.push(`/${roomCode}`);
        }
      }
    });

    return () => {
      window.removeEventListener("keyup", () => {
        console.log("Event listener removed");
      });
    };
  }, []);

  return (
    <>
      <Head>
        <title>Code Share</title>
      </Head>
      <main
        className={
          "flex min-h-screen flex-col items-center justify-center p-24 bg-slate-600 text-white"
        }
      >
        <p className="text-5xl font-semibold font-mono">CODE SHARE 2.O</p>

        <p className="text-2xl font-semibold font-mono mt-20">
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
              <p className="text-2xl text-center font-semibold font-mono text-white bg-slate-700 p-4 rounded-md cursor-pointer">
                Create/Join a room
              </p>
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
