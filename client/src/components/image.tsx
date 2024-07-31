import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import LoaderComponent from "./loader";

async function fetchImageWithToken(imagePath: string) {
  const token: string = useAuthStore.getState().access;
  const response = await fetch(imagePath, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } else {
    throw new Error("Error fetching image");
  }
}

function ImageComponent({ path, height }: { path: string, height: number }) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchImageWithToken(path)
      .then((url) => {
        setImageUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [path]);

  if (loading) {
    return (
      <div className="rounded-lg bg-muted/40 transition-colors duration-300 p-1">
        <div 
        style={{ height: height }}
        className="flex justify-center items-center">
          <LoaderComponent />
        </div>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return <img className="rounded-lg" src={imageUrl} alt="Image" />;
}

export default ImageComponent;
