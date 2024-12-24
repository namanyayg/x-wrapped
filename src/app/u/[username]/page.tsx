import { Metadata } from 'next';
import Link from 'next/link';
import Analysis from '@/components/Analysis';

interface UserData {
  username: string;
  screen_name: string;
  name: string;
  displayName: string;
  description: string | null;
  followers_count: number;
  friends_count: number;
  profile_image_url: string;
  profile_image_url_https: string;
  profile_banner_url: string;
  created_at: string;
}

async function getUserData(username: string): Promise<UserData | null> {
  const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://x.nmn.gl';
  try {
    const apiUrl = `${baseUrl}/api/analyze/${username}`
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const userData = await getUserData(params.username.toLowerCase());
  if (!userData) return { title: 'User Not Found' };

  return {
    title: `${userData.displayName || userData.username}'s X Wrapped`,
    description: `Discover ${userData.username}'s X Wrapped.`,
    twitter: {
      card: 'summary_large_image',
    },
  }
}

export default async function UserAnalysis({ params }: { params: { username: string } }) {
  const userData = await getUserData(params.username.toLowerCase());

  if (!userData) {
    return <div className="bg-white text-center text-gray-500 p-8">User not found</div>;
  }

  return (
    <main className="bg-white text-gray-800">
      <Analysis user={userData} />
    </main>
  );
}
