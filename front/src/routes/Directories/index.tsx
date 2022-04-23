import { SyntheticEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ICreateDirectory } from "../../interfaces/ICreateDirectory";
import { IDirectory } from "../../interfaces/IDirectory";
import {
  createDirectory,
  deleteDirectory,
  getDirectories,
} from "../../services/directories";

const Directories = () => {
  const [directories, setDirectories] = useState<IDirectory[]>([]);
  const [newDirectory, setNewDirectory] = useState<ICreateDirectory>({
    name: "",
  });
  const [error, setError] = useState<string>("");

  const handleDirectories = async () => {
    const { data } = await getDirectories();
    setDirectories(data);
  };

  useEffect(() => {
    handleDirectories();
  }, []);

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setNewDirectory({ name: value });
    setError("");
  };

  const handleSubmit = async () => {
    try {
      if (newDirectory.name.length < 3) {
        setError("Please enter a Directory name of at least 3 characters");
      }
      await createDirectory(newDirectory);
      handleDirectories();
    } catch (err: any) {
      console.log({ err });
    }
  };

  const handleDelete = async (id: number) => {
    await deleteDirectory(id);
    handleDirectories();
  };

  return (
    <div>
      <h1>Directories</h1>
      {directories.map((directory) => (
        <div key={directory.id}>
          <h2>{directory.name}</h2>
          <Link to={`/${directory.id}`}>View Details</Link>
          <button onClick={() => handleDelete(directory.id)}>Delete</button>
        </div>
      ))}
      <input value={newDirectory.name} onChange={handleChange} />
      <button onClick={handleSubmit}>Add Directory</button>
      {error && <p>{error}</p>}
    </div>
  );
};
export default Directories;
