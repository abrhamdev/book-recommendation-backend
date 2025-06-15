import connection from '../config/connection.js';

export const toggleFavorite = async (userId, bookId) => {
    const checkQuery = `SELECT 1 FROM favorites WHERE user_id = ? AND book_id = ?`;
    const insertQuery = `INSERT INTO favorites (user_id, book_id) VALUES (?, ?)`;
    const deleteQuery = `DELETE FROM favorites WHERE user_id = ? AND book_id = ?`;
    
    try {
        const [rows] = await connection.execute(checkQuery, [userId, bookId]);
        
        if (rows.length > 0) {
            await connection.execute(deleteQuery, [userId, bookId]);
            return { isFavorite: false };
        } else {
            await connection.execute(insertQuery, [userId, bookId]);
            return { isFavorite: true };
        }
    } catch (error) {
        throw new Error('Failed to toggle favorite');
    }
};

export const getFavorites = async (userId) => {
    const query = `
        SELECT f.book_id as bookId, 
               b.Title as title, 
               b.Author as author,
               b.coverImage
        FROM favorites f
        LEFT JOIN ethbooks b ON f.book_id = b.bookId
        WHERE f.user_id = ?
    `;
    
    try {
        const [rows] = await connection.execute(query, [userId]);
        return rows;
    } catch (error) {
        throw new Error('Failed to get favorites');
    }
};