import connection from "../config/connection.js"; 

// Function to add a book to the database

export const addbook= async (title, author, publisher, language,publicationYear, genre, description, pageCount,coverImageUrl, bookFileUrl)=> {
  const sql = `INSERT INTO ethbooks 
  (Title, Author, Publisher, Language, PublicationYear, Genre, Description, PageCount, coverImage, path)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const values = [
  title, author, publisher, language,
  publicationYear, genre, description, pageCount,
  coverImageUrl, bookFileUrl
];

await connection.query(sql, values);
}

export const checkBook=async (title)=>{
  const [rows] = await connection.query(
    'SELECT EXISTS(SELECT 1 FROM ethbooks WHERE title = ?) AS book_exists',
    [title]
  );
  return rows[0].book_exists;
}