import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PUBLIC_IMAGES } from "@/api/images";
import LoaderComponent from "@/components/loader";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { InView } from "react-intersection-observer";

export default function Discover() {
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [allImages, setAllImages] = useState([]);
  const [fullyLoaded, setFullyLoaded] = useState(false);

  const { loading, error, data, fetchMore, refetch } = useQuery(
    GET_PUBLIC_IMAGES,
    {
      variables: { page: 1, limit: 10, searchParam: searchInput },
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    if (data && data.publicImages) {
      setAllImages(data.publicImages.images);
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
    setAllImages([]);
    setFullyLoaded(false);
    refetch({ page: 1, limit: 10, searchParam: searchInput });
  }, [searchInput, refetch]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchInput(value);
  };

  const loadMore = async () => {
    const result = await fetchMore({
      variables: {
        page: page + 1,
        limit: 10,
        searchParam: searchInput,
      },
    });
    if (result.data.publicImages.images.length === 0) {
      setFullyLoaded(true);
    } else {
      setPage((prev) => prev + 1);
      setAllImages((prev) => [...prev, ...result.data.publicImages.images]);
    }
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col items-center">
        <h1 className="text-2lg font-semibold text-zinc-300 md:text-4xl xl:text-6xl my-4">
          Discover
        </h1>
        <div className="relative mt-4 w-full md:w-2/3 lg:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={handleInputChange}
            type="text"
            placeholder="Search"
            className="w-full appearance-none bg-muted/40 rounded-lg pl-8 shadow-none outline-none focus:outline-none ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
          />
        </div>
      </div>
      <ScrollArea className="h-full max-h-[calc(80vh-4rem)] w-full p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
          {allImages.map((image, index) => (
            <Link
              key={`${image._id}-${index}`}
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
        </div>
        {loading && !data && <LoaderComponent />}
        {!loading && !fullyLoaded && (
          <InView
            as="div"
            onChange={(inView) => {
              if (inView) {
                loadMore();
              }
            }}
          ></InView>
        )}
      </ScrollArea>
    </main>
  );
}
