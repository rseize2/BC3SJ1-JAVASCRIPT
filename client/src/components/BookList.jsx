import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './../styles/booklist.css'

const BookList = ({ utilisateurId }) => {
    const navigate = useNavigate()
    const [books, setBooks] = useState([])
    const [userRole, setUserRole] = useState('')
    const base = import.meta.env.VITE_BASE_URL || '/'

    useEffect(() => {
        fetch(base+'api/books', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(() => setBooks([]))
        fetch(base+'api/session', { credentials: 'include' })
            .then(res => res.status === 200 ? res.json() : Promise.reject())
            .then(data => setUserRole(data.user.role || 'Guest'))
            .catch(() => setUserRole('Guest'))
    }, [])

    const handleAddBook = () => navigate('/add_book')
    const handleHome = () => navigate('/')

    const handleEmprunt = (bookId) => {
        fetch(`${base}api/books/${bookId}/emprunter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ utilisateur_id: utilisateurId }),
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => alert(data.message))
        .catch(() => alert('Erreur lors de l\'emprunt'))
    }

    return (
        <div className="container">
            <h2>Liste des Livres - Librairie XYZ</h2>
            {books.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>Date de publication</th>
                            <th>Statut</th>
                            <th>Action</th>
                            <th>Détails</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.id}>
                                <td><img className="book-image" src={book.photo_url} alt={book.titre} /></td>
                                <td>{book.titre}</td>
                                <td>{book.auteur}</td>
                                <td>{book.date_publication}</td>
                                <td>{book.statut}</td>
                                <td>
                                    {book.statut === 'disponible' && <button onClick={() => handleEmprunt(book.id)}>Emprunter</button>}
                                </td>
                                <td><a href={`${base}book/${book.id}`}>Voir les détails</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>Erreur lors de la récupération des livres.</p>}
            {userRole === 'admin' && <button onClick={handleAddBook}>Ajouter un livre</button>}
            <button onClick={handleHome}>Retour à l'accueil</button>
        </div>
    )
}

export default BookList
