const Book = require('../models/Books');
const fs = require('fs');


exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error=> res.status(404).json({ error }));
};

exports.getAllBook = (req, res, next) => {
    Book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
};

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);

    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
        .then(()=> res.status(201).json({message: 'Livre enregistré !'}))
        .catch(error => res.status(400).json({ error }));

}
    
exports.modifyBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        // Check if the user is the post owner
        if(book.userId != req.auth.userId){
            res.status(401).json({message: 'Non-autorisé'});
        } else {
            // Check if the user change the file
            if(req.file){
                //If yes, we update the data and the image url
                const updatedBook = {
                    ...JSON.parse(req.body.book),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                };
                delete updatedBook._userId;
                Book.updateOne({_id: req.params.id}, {...updatedBook, _id: req.params.id})
                            .then(()=> {
                                //when the update is done, we can delete the old file
                                const fileNameToDelete = book.imageUrl.split('/images/')[1];
                                fs.unlink( `images/${fileNameToDelete}`, (err) => {
                                    if (err) {
                                      // Handling deletion errors
                                      res.status(500).json({ error: 'Erreur de suppression de fichier' });
                                    } 
                                });
                                res.status(200).json({message : 'Objet modifié !'})
                            })
                            .catch(error => res.status(401).json({ error }));
            } else {
                //if the file doesn't change, we only update the data
                const updatedBook = {...req.body};
                delete updatedBook._userId;

                Book.updateOne({_id: req.params.id}, {...updatedBook, _id: req.params.id})
                            .then(()=> res.status(200).json({message : 'Objet modifié !'}))
                            .catch(error => res.status(401).json({ error }));
            }
        }
    })
    .catch(error => res.status(400).json({ error }));
}

// exports.rateBook = (req, res, next) => {
//     Book.findOne({ _id: req.params.id })
//         .then(book => {
//             if(book.ratings.some(item => item.userId === req.body.userId)){
//                 res.status(401).json({message: 'Note déjà enregistrée pour ce livre'});
//             } else {
//                 book.ratings.push({
//                     userId: req.auth.userId,
//                     grade: req.body.rating
//                 });

//                 book.save()
//                 .then(()=> res.status(201).json({message: 'Note enregistrée !'}))
//                 .catch(error => res.status(400).json({ error }));
//             }
//         })
//         .catch(error => res.status(500).json({ error }));
// }

exports.deleteBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
        .then(book => {
            if(book.userId != req.auth.userId){
                res.status(401).json({message: 'Non-autorisé'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({_id:req.params.id})
                    .then(()=>res.status(200).json({message: 'Livre Supprimé !'}))
                    .catch(error=> res.status(401).json({ error }));
                })
            }
        })
        .catch(error => res.status(500).json({ error }));
};

