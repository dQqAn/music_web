export function updatePagination(divID, currentPage, totalPages, onPageClick) {
    const pagination = document.getElementById(divID);
    pagination.innerHTML = '';

    if (currentPage > 1) {
        const firstLink = document.createElement('a');
        firstLink.textContent = 'First';
        firstLink.onclick = () => onPageClick(1);
        pagination.appendChild(firstLink);

        const prevLink = document.createElement('a');
        prevLink.textContent = 'Before';
        prevLink.onclick = () => onPageClick(currentPage - 1);
        pagination.appendChild(prevLink);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.textContent = i;
        pageLink.onclick = () => onPageClick(i);
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
        pagination.appendChild(pageLink);
    }

    if (currentPage < totalPages) {
        const nextLink = document.createElement('a');
        nextLink.textContent = 'Next';
        nextLink.onclick = () => onPageClick(currentPage + 1);
        pagination.appendChild(nextLink);

        const lastLink = document.createElement('a');
        lastLink.textContent = 'Last';
        lastLink.onclick = () => onPageClick(totalPages);
        pagination.appendChild(lastLink);
    }
}
