'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import UserProfileCard from './UserProfileCard'; // your visual component
import { useRouter } from 'next/navigation';

export default function UserProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const response = await axios.get('http://localhost:3000/users/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user', error);
                alert('Error fetching user profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    if (loading) return <div className="p-8">Loading profile...</div>;
    if (!user) return <div className="p-8 text-red-500">User not found.</div>;

    return (
        <div className="p-4">
            <UserProfileCard user={user} />
        </div>
    );
}
