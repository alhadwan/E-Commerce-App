import React from 'react'
import { FaStarHalfAlt, FaStar, FaRegStar } from 'react-icons/fa'

// This function display the product rating icon according to its value
type ProductRatingProps = {
  value: number;
  count: number | string;
};

const ProductRating = ({ value, count }: ProductRatingProps) => {
  return (
    <>
        {/* using conditional rendering to display the rating stars for each value */}
        <span className='me-2' style={{color: '#f8e825'}}>
        {value >= 1 ? <FaStar/> : value >= 0.5 ? <FaStarHalfAlt /> : <FaRegStar/> }
        {value >= 2 ? <FaStar/> : value >= 1.5 ? <FaStarHalfAlt /> : <FaRegStar/> }
        {value >= 3 ? <FaStar/> : value >= 2.5 ? <FaStarHalfAlt /> : <FaRegStar/> }
        {value >= 4 ? <FaStar/> : value >= 3.5 ? <FaStarHalfAlt /> : <FaRegStar/> }
        {value >= 5 ? <FaStar/> : value >= 4.5 ? <FaStarHalfAlt /> : <FaRegStar/> }
      </span>
      <span >{count && count}</span>

    </>
    
  )
}

export default ProductRating