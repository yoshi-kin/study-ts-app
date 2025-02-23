"use client";
import React from "react";
import BookCard from "./BookCard";

interface Props {
  // title: string;
  books: Book[];
  containerClassName?: string;
}

const BookList = ({ books, containerClassName }: Props) => {
  return (
    <section>
      <h2 className="font-bases-neue text-4xl text-light-100">Popular Books</h2>
      <ul className="book-list">
        {books.map((book) => (
          <BookCard key={book.title} {...book} />
        ))}
      </ul>
    </section>
  );
};

export default BookList;
