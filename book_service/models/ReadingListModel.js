import connection from '../config/connection.js';

export const addToReadingList = async (userId, bookId, status = 'wantToRead') => {
    const query = `
        INSERT INTO reading_list (user_id, book_id, status)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            status = VALUES(status),
            updated_at = CURRENT_TIMESTAMP()
    `;
    const values = [userId, bookId, status];
    
    try {
        const [result] = await connection.query(query, values);
        return result;
    } catch (error) {
        console.error('Error adding to reading list:', error);
        throw new Error('Failed to add to reading list');
    }
};

export const getReadingListByUserId = async (userId) => {
  // Validate userId is a positive integer
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('Invalid user ID');
  }

  const query = `
    SELECT 
      rl.id, 
      rl.book_id as bookId, 
      rl.status, 
      rl.progress,
      rl.created_at as createdAt,
      rl.updated_at as updatedAt,
      IFNULL(b.Title, 'N/A') as title,
      IFNULL(b.Author, 'N/A') as author,
      IFNULL(b.coverImage, 'https://via.placeholder.com/128x196.png%3Ftext=No+Cover') as coverImage,
      IFNULL(b.pageCount, 0) as pageCount,
      b.Description as description
    FROM reading_list rl
    LEFT JOIN ethbooks b ON rl.book_id = b.bookId
    WHERE rl.user_id = ?
    ORDER BY 
      FIELD(rl.status, 'currentlyReading', 'wantToRead', 'completed'),
      rl.updated_at DESC
  `;

  try {
    // Execute with parameter binding
    const [rows] = await connection.execute(query, [userId]);
    return rows;
  } catch (error) {
    console.error('MySQL Error:', {
      query: query,
      params: [userId],
      error: error.message
    });
    throw new Error('Failed to fetch reading list');
  }
};

export const updateReadingStatus = async (userId, bookId, status) => {
    const query = `
        UPDATE reading_list
        SET status = ?,
            updated_at = CURRENT_TIMESTAMP(),
            progress = CASE 
                WHEN ? = 'completed' THEN 100
                WHEN ? = 'currentlyReading' THEN 50
                WHEN ? = 'wantToRead' THEN 0
                ELSE progress
            END
        WHERE user_id = ? AND book_id = ?
    `;
    const values = [status, status, status, userId, bookId];
};

export const updateReadingProgress = async (userId, bookId, progress) => {
    const query = `
        UPDATE reading_list
        SET progress = ?,
            updated_at = CURRENT_TIMESTAMP()
        WHERE user_id = ? AND book_id = ?
    `;
    const values = [progress, userId, bookId];
    
    try {
        const [result] = await connection.query(query, values);
        if (result.affectedRows === 0) {
            throw new Error('Reading list item not found');
        }
        return result;
    } catch (error) {
        console.error('Error updating reading progress:', error);
        throw new Error('Failed to update reading progress');
    }
};

export const removeFromReadingList = async (userId, bookId) => {
    const query = `
        DELETE FROM reading_list
        WHERE user_id = ? AND book_id = ?
    `;
    const values = [userId, bookId];
    
    try {
        const [result] = await connection.query(query, values);
        if (result.affectedRows === 0) {
            throw new Error('Reading list item not found');
        }
        return result;
    } catch (error) {
        console.error('Error removing from reading list:', error);
        throw new Error('Failed to remove from reading list');
    }
};

export const isBookInReadingList = async (userId, bookId) => {
    const query = `
        SELECT 1 FROM reading_list
        WHERE user_id = ? AND book_id = ?
        LIMIT 1
    `;
    const values = [userId, bookId];
    
    try {
        const [rows] = await connection.query(query, values);
        return rows.length > 0;
    } catch (error) {
        console.error('Error checking reading list:', error);
        throw new Error('Failed to check reading list');
    }
};

export const fetchAllReadingList = async (userId, bookId) => {
    const query = `
        SELECT * FROM reading_list
    `;
    
    try {
        const [rows] = await connection.query(query);
      return [rows];
    } catch (error) {
        console.error('Error fetching reading list:', error);
        throw new Error('Failed to check reading list');
    }
};