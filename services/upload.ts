import api, { getErrorMessage } from "@/lib/api";

// Upload avatar
export const uploadAvatar = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const payload = response.data as any;
    // Accept both { url } and { data: { url } }
    const url = payload?.url ?? payload?.data?.url;
    if (!url) {
      throw new Error("Upload avatar succeeded but no URL returned");
    }
    return url;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Upload product images
export const uploadProductImages = async (
  files: File[]
): Promise<string[]> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post<{ urls: string[] }>(
      "/upload/product",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.urls;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Upload fabric image
export const uploadFabricImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<{ url: string }>(
      "/upload/fabric",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.url;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Upload style option image
export const uploadStyleOptionImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<{ url: string }>(
      "/upload/style-option",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.url;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Test S3 connection
export const testS3Connection = async (): Promise<any> => {
  try {
    const response = await api.get("/upload/test");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

