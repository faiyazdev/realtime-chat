import { Suspense } from "react";
import SecureRoomUI from "./_components/SecureRoomUI";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense>
        <SecureRoomUI />
      </Suspense>
    </div>
  );
}
