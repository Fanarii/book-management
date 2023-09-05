document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#form');
    const title = document.querySelector('#inputBook');
    const author = document.querySelector('#inputAuthor');
    const unreadList = document.querySelector('#unread');
    const readedList = document.querySelector('#readed');
    const dateInput = document.querySelector('#date');

    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];

    const RENDER_EVENT = 'render-books';

    function updateLocalStorage(books) {
        localStorage.setItem('books', JSON.stringify(books));
    }

    function createBookElement(book, isReaded) {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book-section');
        bookDiv.innerHTML = `
            <div class="book-name">
                <p class="title">${book.title}</p>
                <p class="author">by ${book.author}, ${book.year}</p>
            </div>
            <div class="book-actions">
                <button class="book-button remove-button">Hapus</button>
                ${isReaded ?
                `<button class="book-button redo-button">Ulangi</button>` :
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

        bookDiv.setAttribute('data-id', book.id);

        return bookDiv;
    }

    function markBookAsDone(book) {
        book.isComplete = true;
        updateLocalStorage(storedBooks);

        const bookElement = unreadList.querySelector(`[data-id="${book.id}"]`);
        if (bookElement) {
            readedList.appendChild(createBookElement(book, true));
            bookElement.remove();
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function markAsUndone(book) {
        book.isComplete = false;
        updateLocalStorage(storedBooks);

        const bookElement = readedList.querySelector(`[data-id="${book.id}"]`);
        if (bookElement) {
            bookElement.remove();
            unreadList.appendChild(createBookElement(book, false));
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function removeBook(book) {
        const index = storedBooks.findIndex((b) => b.id === book.id);
        if (index !== -1) {
            storedBooks.splice(index, 1);
            updateLocalStorage(storedBooks);

            const bookElement = document.querySelector(`[data-id="${book.id}"]`);
            if (bookElement) {
                bookElement.remove();
            }
        }

        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function reload() {
        for (const book of storedBooks) {
            const isReaded = book.isComplete;
            const bookDiv = createBookElement(book, isReaded);

            bookDiv.setAttribute('data-id', book.id);

            if (isReaded) {
                readedList.appendChild(bookDiv);
            } else {
                unreadList.appendChild(bookDiv);
            }
        }
    }

    document.addEventListener(RENDER_EVENT, () => {
        unreadList.innerHTML = '';
        readedList.innerHTML = '';

        for (const book of storedBooks) {
            const isReaded = book.isComplete;
            const bookDiv = createBookElement(book, isReaded);

            bookDiv.setAttribute('data-id', book.id);

            if (isReaded) {
                readedList.appendChild(bookDiv);
            } else {
                unreadList.appendChild(bookDiv);
            }
        }
    });

    function generateId() {
        return +new Date();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const bookTitle = title.value;
        const bookAuthor = author.value;
        const dateValue = dateInput.value;

        const year = new Date(dateValue).getFullYear();

        if (bookTitle.trim() === '' || bookAuthor.trim() === '') {
            alert('Isi nama buku dan penulis...');
            return;
        }

        const newBook = {
            id: generateId(),
            title: bookTitle,
            author: bookAuthor,
            year: year,
            isComplete: false
        };

        title.value = '';
        author.value = '';
        dateInput.value = '';

        const bookDiv = createBookElement(newBook, false);
        unreadList.appendChild(bookDiv);

        storedBooks.push(newBook);
        updateLocalStorage(storedBooks);

        document.dispatchEvent(new Event(RENDER_EVENT));
    });

    reload()
});
