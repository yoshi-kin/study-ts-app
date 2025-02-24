import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { sampleBooks } from "@/constants";
const Home = async () => {
  return (
    <>
      <BookOverview {...sampleBooks[0]} />
      <BookList books={sampleBooks} />
    </>
  );
};

export default Home;
