import React from 'react';
import { AddUserForm } from '../components/AddUserForm';

export function AddUserPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <AddUserForm />
      </div>
    </div>
  );
}
