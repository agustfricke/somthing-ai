import { GET_IMAGE, UPDATE_IMAGE } from "@/api/images";
import ImageComponent from "@/components/image";
import LoaderComponent from "@/components/loader";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";

export default function SoloImage() {
  const { id } = useParams();
  // const { isAuth } = useAuthStore();
  let userId: string;
  userId = useAuthStore.getState()._id;

  const { data, loading, error } = useQuery(GET_IMAGE, {
    variables: {
      id: id,
    },
    skip: !id,
  });

  const [updateImage, { loading: updateLoading }] = useMutation(UPDATE_IMAGE, {
    onCompleted: () => {
      toast.success("Image updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (loading) {
    return (
      <div className="items-center flex justify-center h-screen">
        <LoaderComponent />
      </div>
    );
  }

  if (error) {
    return (
      <div className="items-center flex justify-center h-screen">
        <p>Error description: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 relative">
      <div className="col-span-4 rounded-lg transition-colors duration-300 p-1">
        <ImageComponent
          path={`${import.meta.env.VITE_BACKEND_URL}${data.image.path}`}
        />
      </div>
      <div className="p-4 col-span-3 text-zinc-400">
        <Link
          to="/"
          className="py-1 px-3 rounded-sm bg-zinc-500/40 absolute 
        top-2 right-2 hover:cursor-pointer hover:text-zinc-300"
        >
          X
        </Link>

        {data.image.user._id === userId && (
          <div className="items-top flex space-x-2">
            <Checkbox
              checked={data.image.isPublic}
              onCheckedChange={() => {
                updateImage({
                  variables: {
                    id: data.image._id,
                    isPublic: !data.image.isPublic,
                  },
                });
              }}
              id="isPublic"
            />
            <div className="grid gap-1.5 leading-none mb-4">
              <label
                htmlFor="isPublic"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {data.image.isPublic ? "This image is public, only you can see this." : "This image is private, only you can see this."}
              </label>
            </div>
          </div>
        )}
        <p className="mr-8">Prompt: {data.image.prompt}</p>
      </div>
    </div>
  );
}
