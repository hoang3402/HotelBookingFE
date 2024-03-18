import FileUploader from "@/app/components/FileUploader";
import React from "react";


const ImageUpload = ({image, setImage}: any) => {
  return <div className={'h-[410px]'}>
    <span className="">Image</span>
    <FileUploader
      url={`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_API_KEY_IMAGE_HOST}`}
      acceptedFileTypes={[
        "image/png",
        "image/jpeg",
      ]}
      allowMultiple={false}
      maxFileSize={100}
      labelAlt="Accepted File Types: png, jpeg"
      image={image}
      setImage={setImage}
    />
  </div>
}

export default ImageUpload