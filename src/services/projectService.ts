import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";

export interface Project {
  id?: string;
  title: string;
  category: string;
  imageUrl: string;
  link: string;
  description?: string;
  createdAt?: Timestamp;
}

const COLLECTION_NAME = "projects";

export const getProjects = async (): Promise<Project[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const addProject = async (project: Omit<Project, "id" | "createdAt">) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...project,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

export const deleteProject = async (projectId: string, imageUrl: string) => {
  try {
    // 1. Delete from Firestore
    await deleteDoc(doc(db, COLLECTION_NAME, projectId));
    
    // 2. Delete from Storage if it's a storage URL
    if (imageUrl.includes("firebasestorage.googleapis.com")) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef).catch(err => console.warn("Storage delete failed:", err));
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

const IMGBB_API_KEY = "d31738916419818a85f7264369fffd78";

export const uploadProjectImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error.message || "ImgBB upload failed");
    }
  } catch (error) {
    console.error("Error uploading image to ImgBB:", error);
    throw error;
  }
};
