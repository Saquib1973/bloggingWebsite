import React, { useContext } from 'react'
import { BlogContext } from '../pages/blog.page'
import CommentField from './comment-field.component'
import axios from 'axios';
import NoDataMessage from './nodata.component';
import AnimationWrapper from '../common/page-animation';
import CommentCard from './comment-card.component';

export const fetchComments = async ({ skip = 0, blog_id, setParentCommentCountFun, comment_array = null }) => {
  let response;
  await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments", {
    blog_id, skip
  }).then(({ data }) => {
    data.map(comment => {
      comment.childrenLevel = 0;

    })
    setParentCommentCountFun(prev => prev + data.length)
    if (comment_array === null) {
      response = { results: data }
    } else {
      response = { results: [...comment_array, ...data] }
    }
  })

  return response
}
const CommentContainer = () => {
  let { setBlog, blog, blog: { _id, activity: { total_parent_comments }, title, comments: { results: commentsArr }, comments }, commentWrapper, setCommentWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded } = useContext(BlogContext);
  const loadMoreComments = async () => {
    let newCommentsArray = await fetchComments({ skip: totalParentCommentsLoaded, blog_id: _id, setParentCommentCountFun: setTotalParentCommentsLoaded, comment_array: commentsArr });
    setBlog({ ...blog, comments: newCommentsArray })

  }
  return (
    <div className={`max-sm:w-full fixed ${commentWrapper ? "top-0 sm:top-1/2 sm:-translate-y-[45%] sm:bottom-0" : "top-[100%] sm:bottom-[-100%]"} duration-700 max-sm:right-0 sm:bottom-0 sm:right-1/2 sm:translate-x-1/2 w-[80%] md:w-[70%] xl:w-[50%] min-w-[350px] h-full sm:h-[88%] rounded-xl z-50  bg-white shadow-2xl p-8 px-6  sm:px-8 md:px-10 xl:px-16 overflow-y-auto overflow-x-hidden`}>
      <div className='relative'>
        <h1 className='text-xl font-medium'>
          Comments
        </h1>
        <p className='text-lg mt-2 w-[70%] text-dark-grey line-clamp-1'>
          {title}
        </p>
        <button className='absolute top-0 -right-5 flex items-center justify-center w-12 h-12 rounded-full hover:text-grey hover:bg-red/90 transition-all bg-grey/60'
          onClick={() => {
            setCommentWrapper(prev => !prev)
          }}
        >
          <i className="fi fi-rr-cross text-xl mt-1"></i>
        </button>
      </div>
      <hr className='border-grey my-8 w-[110%] -ml-12' />
      <CommentField action={'comment'} />

      {

        commentsArr && commentsArr.length ?
          commentsArr.map((comment, index) => {
            return <AnimationWrapper key={index}>
              <CommentCard index={index} leftVal={(comment.childrenLevel) * 4} commentData={comment} />
            </AnimationWrapper>
          })
          : <NoDataMessage message={'No comments found'} />
      }
      {
        total_parent_comments > totalParentCommentsLoaded ?
          <button className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2
          border-2 border-transparent active:border-dark-grey/50 transition-all duration-500 bg-grey/80 mx-auto
          '
            onClick={loadMoreComments}
          >Load more</button> : ""
      }
    </div>
  )
}

export default CommentContainer