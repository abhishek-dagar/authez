import { GetSeverUser, SignOut } from "@/lib/auth";
import { Button } from "@repo/ui/components/ui/button";
import React from "react";

const ProfilePage = async () => {
  const user = await GetSeverUser();

  return (
    <div>
      <p>{user?.name}</p>
      <Button onClick={() => SignOut()}>Logout</Button>
    </div>
  );
};

export default ProfilePage;
