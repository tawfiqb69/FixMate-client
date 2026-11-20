import { notFound } from "next/navigation";

// Catches every unknown URL so the 404 page always appears inside the public layout (navbar + footer).
export default function CatchAllNotFound() {
  notFound();
}