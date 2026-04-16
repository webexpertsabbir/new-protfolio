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

export const uploadProjectImage = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
