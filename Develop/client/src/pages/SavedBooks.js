import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, GET_ME } from '../utils/queries';
import { useMutation } from '@apollo/client';
import { DELETE_BOOK } from '../utils/mutation';

const SavedBooks = () => {
  const { username: userParam } = useParams();
  const [deleteBook] = useMutation(DELETE_BOOK,{
    update(cache, { data: { deleteBook} }) {
    const { me } = cache.readQuery({ query: GET_ME });
    cache.writeQuery({
      query: GET_ME,
      data: { me: { ...me, savedBooks: [...me.savedBooks, deleteBook] } }
    });
  }
});

  const { data } = useQuery(userParam ? QUERY_USER : GET_ME, {
    variables: { username: userParam }
  });

  const userData = data?.me || data?.user || {};

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    try {
      await deleteBook(
        {variables: { bookId }
      });
    } catch (err) {
      console.error(err);
    }
    // setUserData(updatedUser);
    // upon success, remove book's id from localStorage
    removeBookId(bookId);
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
