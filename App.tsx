import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";

interface AppProps {
  userId: string;
  userName: string | null;
  token: string;
}

const App: React.FC<AppProps> = ({ userId, userName, token }) => {
  return (
    <div className="p-5">
      <Card>
        <CardHeader>
          <CardTitle>Replex-Auth</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">User ID:</span>
            <Badge variant="secondary">{userId}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">User Name:</span>
            <Badge variant="secondary">{userName || "Unknown"}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Token:</span>
            <Badge variant="secondary" className="truncate max-w-[200px]">
              {token}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
