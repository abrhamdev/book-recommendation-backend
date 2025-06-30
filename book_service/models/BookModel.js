import connection from "../config/connection.js"; 
import { convertToDirectUrl, convertToDownloadUrl } from '../services/driveService.js';

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

export const searchEthBooks = async (query) => {
  const [rows] = await connection.query(`
    SELECT 
      bookId as id,
      Title as title,
      Author as author,
      Publisher as publisher,
      Language as language,
      YEAR(PublicationYear) as publicationYear,
      Genre as genre,
      Description as description,
      pageCount,
      coverImage,
      path
    FROM ethbooks 
    WHERE Title LIKE ? OR Author LIKE ? OR Genre LIKE ?`,
    [`%${query}%`, `%${query}%`, `%${query}%`]
  );
  return rows.map(book => ({
    ...book,
    coverImageUrl: convertToDirectUrl(book.coverImage),
    bookFileUrl: convertToDownloadUrl(book.path)
  }));
};

export const getEthBook = async (id) => {
  const [rows] = await connection.query(`
      SELECT 
        bookId as id,
        Title as title,
        Author as author,
        Publisher as publisher,
        Language as language,
        YEAR(PublicationYear) as publicationYear,
        Genre as genre,
        Description as description,
        pageCount,
        coverImage,
        path
      FROM ethbooks 
      WHERE bookId = ?`,
    [id]
  );
    
  return rows.map(book => ({
    ...book,
    coverImageUrl: convertToDirectUrl(book.coverImage),
    bookFileUrl: convertToDownloadUrl(book.path)
  }));
}
export const fetchAllBooks=async (title)=>{
  try{
    const [rows] = await connection.query(`SELECT 
      bookId,
      Title,
      Author,
      Publisher,
      Language,
      YEAR(PublicationYear),
      Genre,
      Description,
      pageCount,
      coverImage
    FROM ethbooks`);
    
    rows.map(book => ({
      ...book,
      coverImage: convertToDirectUrl(book.coverImage)
    }));
    return [rows];
  }catch(error){
    console.log(error);
  }
}