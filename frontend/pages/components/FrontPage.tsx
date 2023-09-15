import { useState, useEffect } from "react";
import axios from "axios";

const FrontPage = () => {
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<any | null>(null);

  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectImage] = useState("");
  const [selectedFile, setSelectFile] = useState<File>();

  const handleUpload = async () => {
    setUploading(true);
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("myImage", selectedFile);
      const { data } = await axios.post("/api/image", formData);
      console.log(data);
    } catch (error: any) {
      console.log(error.response?.data);
    }
    setUploading(false);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (description === "") {
      setMessage("Please provide a name and description");
      return;
    }

    await createImage();
  };

  const createImage = async () => {
    setMessage("Generating Image...");

    const url = "http://127.0.0.1:12345";

    const data = {
      userimagepath: "../../userImage/NFT.png",
      description: description,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const resultData = await response.json();
        setImage(resultData);

        setMessage("Image Generated Successfully");
      } else {
        console.error(`Error: ${response.status}`);
        setMessage("Image generation failed 1");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Image generation failed 2");
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-20 space-y-6">
      <div className="form">
        <form onSubmit={submitHandler}>
          <label>
            <input
              type="file"
              hidden
              onChange={({ target }) => {
                if (target.files) {
                  const file = target.files[0];
                  setSelectImage(URL.createObjectURL(file));
                  setSelectFile(file);
                }
              }}
            />
            <div
              className="w-40 aspect-video rounded flex items-center justify-center
          border-2 border-dashed cursor-pointer text-white">
              {selectedImage ? (
                <img src={selectedImage} alt=""></img>
              ) : (
                <span>Select Image</span>
              )}
            </div>
          </label>

          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{ opacity: uploading ? ".5" : "1" }}
            className="bg-red-600 p-3 w-32 text-center rounded-full text-white">
            {uploading ? "Uploading.." : "Upload"}
          </button>

          <input
            type="text"
            placeholder="Create a description..."
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="homepage__btn" type="submit">
            Mint
          </button>

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </form>
        <div className="card">
          {image}
          {message}
        </div>
      </div>

      {image && (
        <div>
          <br />
          <br />
          <br />
          <br />
          <h3>Response from Backend:</h3>
          <pre>{JSON.stringify(image, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FrontPage;