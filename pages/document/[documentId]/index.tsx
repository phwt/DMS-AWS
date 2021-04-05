import { useRouter } from "next/router";

const Document = () => {
  const router = useRouter();
  const { documentId } = router.query;

  return <p>Single Document: {documentId}</p>;
};

export default Document;
