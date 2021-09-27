export const uploadFiles = () => {
  return {
    type: "uploaded",
    filesUploaded: true,
  };
};

export const resetUploadedFiles = () => {
  return {
    type: "uploaded",
    filesUploaded: false,
  };
};
