import { ScrollArea } from "@/components/ui/scroll-area";
import LoaderComponent from "@/components/loader";
import { useQuery } from "@apollo/client";
import { GET_USER_IMAGES } from "@/api/images";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { InView } from "react-intersection-observer";
import { useAuthStore } from "@/store/auth";

export default function UserImages({ isLoading }: { isLoading: boolean }) {
  const [page, setPage] = useState(1);
  const [allImages, setAllImages] = useState([]);
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const token: string = useAuthStore.getState().access;

  const { loading, error, data, fetchMore } = useQuery(GET_USER_IMAGES, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { page: 1, limit: 10 },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data && data.userImages) {
      setAllImages(data.userImages.images);
    }
  }, [data]);

  const loadMore = async () => {
    const result = await fetchMore({
      variables: {
        page: page + 1,
        limit: 10,
      },
    });
    if (result.data.userImages.images.length === 0) {
      setFullyLoaded(true);
    } else {
      setPage((prev) => prev + 1);
      setAllImages((prev) => [...prev, ...result.data.userImages.images]);
    }
  };

  console.log(data);
  console.log(fullyLoaded);
  console.log(page);
  console.log("loading and full", !loading && !fullyLoaded);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <ScrollArea className="h-full w-full p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {isLoading && (
          <div className="rounded-lg hover:bg-zinc-500/50 bg-muted/40 transition-colors duration-300 p-1">
            <div className="flex justify-center items-center h-full">
              <LoaderComponent />
            </div>
          </div>
        )}
        {allImages.map((image) => (
          <Link
            key={`${image._id}`}
            to={`/image/${image._id}`}
            className="hover:cursor-pointer rounded-lg hover:bg-zinc-500/50 transition-colors duration-300 p-1"
          >
            <img
              className="rounded-lg w-full h-48 object-cover"
              src={image.path}
              alt={image.prompt}
            />
            <p className="mt-2 text-sm text-zinc-300">{image.prompt}</p>
          </Link>
        ))}

        {loading && !data && <LoaderComponent />}
        {!loading && !fullyLoaded && (
          <InView
            as="div"
            onChange={(inView) => {
              if (inView) {
                loadMore();
              }
              console.log("in view", inView);
            }}
          ></InView>
        )}
      </div>
      </ScrollArea>
    </div>
  );
}
