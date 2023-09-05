document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const title = document.getElementById('inputBook');
    const author = document.getElementById('inputAuthor');
    const unreadList = document.getElementById('unread');
    const readedList = document.getElementById('readed');

    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];

    function updateLocalStorage(books) {
        localStorage.setItem('books', JSON.stringify(books));
    }

    function createBookElement(book, isReaded) {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book-section');
        bookDiv.innerHTML = `
            <div class="book-name">
                <p class="title">${book.title}</p>
                <p class="author">by ${book.author}</p>
            </div>
            <div class="book-actions">
                ${isReaded ?
                `<button class="book-button redo-button">Ulangi</button>
                     <button class="book-button remove-button">Hapus</button>` :
                `<button class="book-button done-button">Selesai</button>`
            }
            </div>
        `;

        const doneButton = bookDiv.querySelector('.done-button');
        const redoButton = bookDiv.querySelector('.redo-button');
        const removeButton = bookDiv.querySelector('.remove-button');

        if (isReaded) {
            redoButton.addEventListener('click', () => {
                markAsUndone(book);
            });

            removeButton.addEventListener('click', () => {
                removeBook(book);
            });
        } else {
            doneButton.addEventListener('click', () => {
                markBookAsDone(book);
            });
        }

        return bookDiv;
    };

    function markBookAsDone(book) {
        book.readed = true;
        updateLocalStorage(storedBooks);

        const bookElement = unreadList.querySelector(`[data-title="${book.title}"]`);
        if (bookElement) {
            readedList.appendChild(createBookElement(book, true));
            bookElement.remove();
        }
    };

    function markAsUndone(book) {
        book.readed = false;
        updateLocalStorage(storedBooks);
    
        const bookElement = readedList.querySelector(`[data-title="${book.title}"]`);
        if (bookElement) {
            bookElement.remove();
            unreadList.appendChild(createBookElement(book, false));
        };

        window.location.reload();
    };
    

    function removeBook(book) {
        const index = storedBooks.findIndex((b) => b.title === book.title);
        if (index !== -1) {
            storedBooks.splice(index, 1);
            updateLocalStorage(storedBooks);

            const bookElement = document.querySelector(`[data-title="${book.title}"]`);
            if (bookElement) {
                bookElement.remove();
            }
        }
    };

    for (book of storedBooks) {
        const isReaded = book.readed;
        const bookDiv = createBookElement(book, isReaded);
        bookDiv.setAttribute('data-title', book.title);

        if (isReaded) {
            readedList.appendChild(bookDiv);
        } else {
            unreadList.appendChild(bookDiv);
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const bookTitle = title.value;
        const bookAuthor = author.value;

        if (bookTitle.trim() === '' || bookAuthor.trim() === '') {
            alert('isi nama buku dan author...');
            return;
        }

        const newBook = {
            title: bookTitle,
            author: bookAuthor,
            readed: false
        };

        title.value = '';
        author.value = '';

        const bookDiv = createBookElement(newBook, false);
        bookDiv.setAttribute('data-title', newBook.title);
        unreadList.appendChild(bookDiv);

        storedBooks.push(newBook);
        updateLocalStorage(storedBooks);
    });
});
