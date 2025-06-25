import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const router = useRouter();

  useEffect(() => {
    console.log('404');
    router.replace('/home');
  }, [router]);

  return null;
} 