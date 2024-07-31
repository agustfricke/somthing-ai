import { Input } from "@/components/ui/input";
import { CornerDownLeft, Loader } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import Login from "@/components/login";
import UserImages from "@/components/user-images";
import { useMutation } from "@apollo/client";
import { GENERATE_IMAGE } from "@/api/images";
import { gql } from "@apollo/client";
import { Checkbox } from "@/components/ui/checkbox";

export default function GenerateImage() {
  const { isAuth } = useAuthStore();
  const token: string = useAuthStore.getState().access;
  const [prompt, setPrompt] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [generateImage, { loading }] = useMutation(GENERATE_IMAGE, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      toast.success("Image generated successfully.");
      setPrompt("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    update(cache, { data: { generateImage } }) {
      cache.modify({
        fields: {
          userImages(existingData = {}) {
            const newImageRef = cache.writeFragment({
              data: generateImage,
              fragment: gql`
                fragment NewImage on Image {
                  _id
                  path
                  prompt
                }
              `,
            });
            return {
              ...existingData,
              images: [newImageRef, ...existingData.images],
            };
          },
        },
      });
    },
  });

  const handleSubmit = (e: any) => {
    if (loading) {
      toast.error("Generating image, please wait...");
      return;
    }
    if (prompt === "") {
      toast.error("Please enter a prompt");
      return;
    }
    if (prompt.length > 155) {
      toast.error("Please enter a prompt less than 155 characters");
      return;
    }
    e.preventDefault();
    generateImage({
      variables: {
        prompt,
        isPublic,
      },
    });
  };

  if (!isAuth) {
    return <Login />;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col items-center">
        <h1 className="text-2lg font-semibold text-zinc-300 md:text-4xl xl:text-6xl my-4">
          Generate image
        </h1>
        <div className="relative mt-4 w-full md:w-2/3 lg:w-1/3">
          <form onSubmit={handleSubmit}>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              maxLength={155}
              placeholder="Describe your image"
              className="w-full appearance-none bg-muted/40 rounded-lg pr-8 shadow-none outline-none focus:outline-none ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            />
            <div className="items-top flex space-x-2 mt-4">
              <Checkbox
                checked={isPublic}
                onCheckedChange={(checked: boolean) => setIsPublic(checked)}
                id="isPublic"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="isPublic"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                {isPublic ? "Public image" : "Private image"}
                </label>
                <p className="text-sm text-muted-foreground">
                  You can change this setting later
                </p>
              </div>
            </div>
            {loading ? (
              <Loader className="animate-spin slower absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            ) : (
              <button type="submit">
                <CornerDownLeft
                  onClick={handleSubmit}
                  className="hover:cursor-pointer hover:text-white absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                />
              </button>
            )}
          </form>
        </div>
      </div>
      <UserImages isLoading={loading} />
    </main>
  );
}
