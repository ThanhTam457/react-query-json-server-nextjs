import ReactPaginate from 'react-paginate';

type props = {
    pageCount: number,
    currentPage: number,
    handlePageClick: (selectedItem: { selected: number }) => void
}

const Paginate = (props:props) => {
    return ( 
        <div className='paginate d-flex justify-content-center'>
            <ReactPaginate
                breakLabel="..."
                previousLabel={<i className="fa-solid fa-chevron-left"></i>}
                nextLabel={<i className="fa-solid fa-chevron-right"></i>}
                onPageChange={props.handlePageClick}
                pageRangeDisplayed={3}
                pageCount={props.pageCount} 
                marginPagesDisplayed={2}                
                renderOnZeroPageCount={null}
                forcePage={props.currentPage}
            />
        </div>
     );
}

export default Paginate;