const express = require('express')
const router = express.Router()
const db = require('./../services/database')

router

.get('/', (_, res) => {
    const sql = 'SELECT * FROM livres'
    db.query(sql, (err, results) => {
        if (err) throw err
        res.json(results)
    })
})

.post('/', (req, res) => {
    const { title, author, date_publication, isbn, description, status, cover } = req.body
    const sql = 'INSERT INTO livres (titre, auteur, date_publication, isbn, description, statut, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)'
    db.query(sql, [title, author, date_publication, isbn, description, status || "disponible", cover], (err) => {
        if (err) res.staus(400).send("Erreur d'envoi")
        res.send('Livre ajouté')
    })
})

.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM livres WHERE id = ?'
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err
        res.json(result)
    })
})

.put('/:id', (req, res) => {
    const { title, author, published_date, isbn, description, status, photo_url } = req.body
    const sql = 'UPDATE livres SET titre = ?, auteur = ?, date_publication = ?, isbn = ?, description = ?, statut = ?, photo_url = ? WHERE id = ?'
    db.query(sql, [title, author, published_date, isbn, description, status, photo_url, req.params.id], (err, result) => {
        if (err) throw err
        res.send('Livre mis à jour')
    })
})

.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM livres WHERE id = ?'
    db.query(sql, [req.params.id], (err) => {
        if (err) throw err
        res.send('Livre supprimé')
    })
})

router.post('/:id/emprunter', (req, res) => {
    const livreId = req.params.id
    const { utilisateur_id } = req.body

    const sql = `
        INSERT INTO emprunts (id_utilisateur, id_livre, date_emprunt, date_retour_prevue)
        VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY))
    `
    db.query(sql, [utilisateur_id, livreId], (err, result) => {
        if (err) return res.status(500).json({ message: "Erreur lors de l'emprunt" })
        res.json({ message: "Emprunt créé", empruntId: result.insertId })
    })
})

router.get('/:id/emprunts', (req, res) => {
    const { id } = req.params
    const sql = `
        SELECT e.id, l.titre, l.auteur, e.date_emprunt, e.date_retour_prevue
        FROM emprunts e
        JOIN livres l ON e.id_livre = l.id
        WHERE e.id_utilisateur = ?
    `
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la récupération des emprunts" })
        res.json(results)
    })
})

router.post('/:id/retour', (req, res) => {
    const { id } = req.params
    const { utilisateur_id } = req.body

    const sql = `
        DELETE FROM emprunts
        WHERE id_livre = ? AND id_utilisateur = ?
    `
    db.query(sql, [id, utilisateur_id], (err, result) => {
        if (err) return res.status(500).json({ message: "Erreur lors du retour du livre" })
        res.json({ message: "Livre retourné avec succès" })
    })
})


module.exports = router