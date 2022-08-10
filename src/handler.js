const { nanoid } = require("nanoid");
const books = require("./books");

// Create a new book
const addBookHandler = (request, h) => {
	const id = nanoid(16);

	const { name, year, author, summary, publisher, pageCount, readPage, reading } =
		request.payload;

	const finished = pageCount === readPage ? true : false;
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;

	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	};

	if (newBook?.name === undefined) {
		const res = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. Mohon isi nama buku",
		});
		res.code(400);
		return res;
	} else if (newBook?.readPage > newBook?.pageCount) {
		const res = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
		});
		res.code(400);
		return res;
	} else {
		books.push(newBook);

		const isSuccess = books.filter((book) => book?.id === id).length > 0;

		if (isSuccess) {
			const { id: bookId } = newBook;
			const res = h.response({
				status: "success",
				message: "Buku berhasil ditambahkan",
				data: {
					bookId,
				},
			});
			res.code(201);
			return res;
		}
	}

	const response = h.response({
		status: "error",
		message: "Buku gagal ditambahkan",
	});
	response.code(500);
	return response;
};

// Get all books
const getAllBooksHandler = (request, h) => {
	const { name, reading, finished } = request?.query;

	let filteredBooks = books;

	if (name) {
		filteredBooks = filteredBooks.filter((book) =>
			book.name.toLowerCase().includes(name.toLowerCase())
		);
	}
	if (reading) {
		if (reading === "1") {
			filteredBooks = filteredBooks.filter((book) => book.reading === true);
		}
		if (reading === "0") {
			filteredBooks = filteredBooks.filter((book) => book.reading === false);
		}
	}

	if (finished) {
		if (finished === "1") {
			filteredBooks = filteredBooks.filter((book) => book.finished === true);
		}
		if (finished === "0") {
			filteredBooks = filteredBooks.filter((book) => book.finished === false);
		}
	}

	const res = h.response({
		status: "success",
		data: {
			books: filteredBooks.map((book) => ({
				id: book?.id,
				name: book?.name,
				publisher: book?.publisher,
			})),
		},
	});
	res.code(200);
	return res;
};

// Get a book by id
const getBookByIdHandler = (request, h) => {
	const { id } = request?.params;

	const data = books.find((book) => book?.id === id);

	if (data === undefined) {
		const res = h.response({
			status: "fail",
			message: "Buku tidak ditemukan",
		});
		res.code(404);
		return res;
	}

	const response = h.response({
		status: "success",
		message: "Buku telah ditemukan",
		data: {
			book: data,
		},
	});
	response.code(200);
	return response;
};

// Edit a book by id
const editBookByIdHandler = (request, h) => {
	const { id } = request?.params;

	const { name, year, author, summary, publisher, pageCount, readPage, reading } =
		request?.payload;

	const updatedAt = new Date().toISOString();

	const updatedBook = books.findIndex((book) => book?.id === id);

	if (name === undefined) {
		const response = h.response({
			status: "fail",
			message: "Gagal memperbarui buku. Mohon isi nama buku",
		});
		response.code(400);
		return response;
	} else if (readPage > pageCount) {
		const response = h.response({
			status: "fail",
			message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
		});
		response.code(400);
		return response;
	}

	if (updatedBook !== -1) {
		books[updatedBook] = {
			...books[updatedBook],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			updatedAt,
		};

		const response = h.response({
			status: "success",
			message: "Buku berhasil diperbarui",
		});
		response.code(200);
		return response;
	}

	const res = h.response({
		status: "fail",
		message: "Gagal memperbarui buku. Id tidak ditemukan",
	});
	res.code(404);
	return res;
};

// Delete a book by id
const deleteBookByIdHandler = (request, h) => {
	const { id } = request?.params;

	const index = books.findIndex((book) => book?.id === id);

	if (index !== -1) {
		books.splice(index, 1);

		const res = h.response({
			status: "success",
			message: "Buku berhasil dihapus",
		});
		res.code(200);
		return res;
	}

	const response = h.response({
		status: "fail",
		message: "Buku gagal dihapus. Id tidak ditemukan",
	});
	response.code(404);
	return response;
};

module.exports = {
	addBookHandler,
	getAllBooksHandler,
	getBookByIdHandler,
	editBookByIdHandler,
	deleteBookByIdHandler,
};
