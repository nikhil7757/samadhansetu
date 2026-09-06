import { RouterProvider } from 'react-router';
import { AuthProvider } from '@/lib/auth';
import { router } from '@/routes';
import './i18n';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
