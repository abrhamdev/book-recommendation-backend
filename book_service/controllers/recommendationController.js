import axios from 'axios';

export const getRecommendation=async (req,res)=>{
  const { userId } = req.body;
  try{
    const userPreference = await axios.get(`${process.env.USERS_SERVICE}/users/me/getPreference?userId=${userId}`);
    const preference = userPreference.data;
    const recommendations = await axios.post(`http://localhost:5000/recommend`, preference);
    const recommendedISBNs = recommendations.data.books;
    console.log(recommendedISBNs);
    //Fetch book details from Google Books API for each ISBN
      const books = await Promise.all(
        recommendedISBNs.map(async (isbn) => {
          try {
            const response = await axios.get(
              `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
            );
            const items = response.data.items;
            if (items && items.length > 0) {
              const book = items[0].volumeInfo;
              return {
                id: items[0].id,
                title: book.title,
                authors: book.authors || [],
                description: book.description || '',
                publisher: book.publisher || '',
                publishedDate: book.publishedDate || '',
                pageCount: book.pageCount || null,
                categories: book.categories || [],
                language: book.language || '',
                thumbnail: book.imageLinks?.thumbnail || '',
                previewLink: book.previewLink || '',
                isbn: isbn,
              };
            }
          } catch (err) {
            console.error(`Error fetching book for ISBN ${isbn}:`, err.message);
          }
          return null;
        })
      );
        
    const filteredBooks = books.filter((book) => book !== null);
    return res.status(200).json({ books: filteredBooks,});
  }catch(error){
    console.log("error ".error);
  }
}