import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

async function fetchImageWithToken(imagePath: string) {
  const token: string = useAuthStore.getState().access;
  const response = await fetch(imagePath, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.ok) {
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } else {
    throw new Error('Error fetching image');
  }
}

function ImageComponent({ path }: { path: string }) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchImageWithToken(path)
      .then(url => {
        setImageUrl(url);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [path]);

  if (loading) {
    return <p>Loading...</p>; 
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <img
      className="rounded-lg"
      src={imageUrl}
      alt="Image"
    />
  );
}

export default ImageComponent;
