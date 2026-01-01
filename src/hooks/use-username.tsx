import { useEffect, useState } from "react";
import { generateUsername } from "@/lib/generate-username";

function useUsername() {
  const [username, setUsername] = useState<null | string>(null);
  const STORAGE_KEY = "realtime-chat-username";

  useEffect(() => {
    const storedUsername = localStorage.getItem(STORAGE_KEY);
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      const generatedUsername = generateUsername();
      localStorage.setItem(STORAGE_KEY, generatedUsername);
      setUsername(generatedUsername);
    }
  }, [username]);

  if (!username) {
    return { username: "Loading..." };
  }
  return { username };
}

export default useUsername;
