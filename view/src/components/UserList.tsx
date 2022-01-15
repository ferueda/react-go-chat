import React from 'react';

export default function UserList({ users }: { users: string[] }) {
  return (
    <div className="bg-white rounded-md px-6 py-4">
      <h3 className="mb-2 font-bold">Who's online?</h3>
      {users.length === 0 ? (
        <div className="text-gray-400">Chat is empty</div>
      ) : (
        <ul>
          {users.map((u) => (
            <div className="flex items-center">
              <div className="bg-green-600 w-2 h-2 rounded-full mr-2" />
              <li key={u}>{u}</li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
