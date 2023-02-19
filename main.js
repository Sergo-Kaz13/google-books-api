const apiUrl =
  "https://www.googleapis.com/books/v1/volumes?startIndex=0&maxResults=40&q=";
const [searchForm] = document.forms;
const loading = document.querySelector(".loading");
const bookList = document.querySelector(".books");

searchForm.onsubmit = () => {
  getSearchResults().then(showResults);
};

function getSearchResults() {
  const query = searchForm.query.value;

  return fetch(apiUrl + `"${query}"`)
    .then((res) => res.json())
    .then(extractCustomData);
}

function extractCustomData(searchResults) {
  return searchResults.items.map(({ volumeInfo }) => {
    const {
      title,
      authors,
      publishedDate,
      description,
      industryIdentifiers: [{ identifier: isbn }] = [{}],
      pageCount,
      categories,
      imageLinks,
      language,
      previewLink,
    } = volumeInfo;

    return {
      title,
      authors,
      publishedDate,
      description,
      isbn,
      pageCount,
      categories,
      imageLinks,
      language,
      previewLink,
    };
  });
}

function showResults(books) {
  loading.remove();

  bookList.innerHTML = books
    .filter(
      ({ authors, imageLinks, description }) =>
        authors && imageLinks && description
    )
    .map(buildBookItem)
    .join("");
}

function buildBookItem({
  title,
  authors,
  publishedDate,
  description,
  isbn,
  pageCount,
  categories,
  imageLinks: { thumbnail, smallThumbnail } = {},
  language,
  previewLink,
}) {
  return `
    <li class="book">
      <div class="book-img">
        <img
          src="${thumbnail || smallThumbnail}"
          alt=""
        />
      </div>
      <div class="book-info">
        <h4 class="title">${title}</h4>
        <p class="description">
        ${description}
        </p>
        <h4 class="authors"><span>Authors: </span>${authors}</h4>
        <div class="categories"><span>Categories: </span>${categories}</div>
        <p class="published-date"><span>Publication date: </span>${publishedDate}</p>
        <p class="page-count"><span>Pages: </span>${pageCount || "unknown"}</p>
        <p class="industry-identifiers"><span>ISBN_13: </span>${isbn}</p>
        <p class="language"><span>Language: </span>${language}</p>
        <a
          class="btn-link-read"
          href="${previewLink}"
          target="_blank"
          >read online</a
        >
      </div>
    </li>
  `;
}
