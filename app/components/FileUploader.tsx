'use client'
import React, {ChangeEvent, useRef, useState} from 'react';
import Image from "next/image";

interface FileUploaderProps {
  acceptedFileTypes?: string[] | null;
  url: string;
  maxFileSize?: number;
  allowMultiple?: boolean;
  label?: string;
  labelAlt?: string;
  image?: any;
  setImage?: any;
}

export default function FileUploader(props: FileUploaderProps) {
  const {
    acceptedFileTypes,
    url, maxFileSize = 5,
    allowMultiple = false,
    label = "",
    labelAlt = "",
    image,
    setImage
  } = props;

  const MAX_FILE_BYTES = maxFileSize * 1024 * 1024; // MB to bytes

  // Change the state structure to handle multiple file progress and status
  const [fileStatus, setFileStatus] = useState<{ [key: string]: string }>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const isError = Object.values(fileStatus).some(status => status !== 'Uploaded');

  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetUploader = () => {
    setFileStatus({});
    setUploadError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileSelectedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setUploadError(null); // reset the upload error when a new file is selected
    if (event.target.files) {
      const files = Array.from(event.target.files);
      let isValid = true; // Flag to check if all files are valid
      let fileErrors: { [key: string]: string } = {};

      for (const file of files) {
        if (file.size > MAX_FILE_BYTES) {
          fileErrors[file.name] = `File size cannot exceed ${maxFileSize} MB`;
          isValid = false;
        }
        if (acceptedFileTypes && !acceptedFileTypes.includes(file.type)) {
          fileErrors[file.name] = "File type not accepted. Accepted types: " + acceptedFileTypes.join(', ');
          isValid = false;
        }
      }

      if (!isValid) {
        setFileStatus(fileErrors);
      } else {
        files.forEach(file => {
          fileUploadHandler(file);
        });
      }
    }
  };

  const fileUploadHandler = (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          setFileStatus(prev => ({...prev, [file.name]: 'Uploaded'}));
          let data = JSON.parse(xhr.responseText);
          setImage(data.data.display_url);
          setUploadSuccess(true);
        } else {
          setFileStatus(prev => ({
            ...prev,
            [file.name]: "An error occurred while uploading the file. Server response: " + xhr.statusText
          }));
        }
      }
    });

    xhr.send(formData);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-60 md:h-48">
      <div className="form-control w-full rounded-2xl">
        <label htmlFor="image-upload">
          <Image
            className={'cursor-pointer object-cover w-[600px] h-[400px] rounded-2xl'}
            referrerPolicy="no-referrer"
            alt={'Uploaded image'}
            src={image ?? 'https://placehold.co/600x400.png'}
            width={600}
            height={400}
          />
        </label>
        <input
          type="file"
          id="image-upload"
          className="file-input file-input-bordered file-input-primary w-full hidden"
          onChange={fileSelectedHandler}
          accept={acceptedFileTypes ? acceptedFileTypes.join(',') : undefined}
          ref={fileInputRef}
          multiple={allowMultiple}
        />
        <label className="label">
          <span className="label-text-alt text-red-500">{uploadError}</span>
        </label>
      </div>
    </div>
  );
}