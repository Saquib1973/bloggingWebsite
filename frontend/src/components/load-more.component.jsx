import React from "react";

const LoadMoreDataButton = ({ state, fetchData }) => {
  if (state !== null && state?.totalDocs > state?.results?.length) {
    return (
      <button
        className="text-dark-grey p-3 border-2 border-transparent active:border-dark-grey/50 transition-all duration-500 bg-grey/80 rounded-md flex items-center"
        onClick={() => fetchData({ page: state.page + 1 })}
      >
        Load More
      </button>
    );
  }
};

export default LoadMoreDataButton;
