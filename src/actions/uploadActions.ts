export const uploadFiles = () => {
  return {
    type: "uploaded",
    isFilesUploaded: true,
  };
};

export const resetUploadedFiles = () => {
  return {
    type: "uploaded",
    isFilesUploaded: false,
  };
};
