import React, { useState } from 'react'
import { useLangStore } from '../assets/store/langStore';
import { langText } from '../assets/constants/lang';

function Reviews() {
    const { lang } = useLangStore();
    const [reviewsToShow, setReviewsToShow] = useState(5);
    const reviews = [
      {
        name: "kamal",
        review: "the food is very good",
        date: "03 december 2025",
        rating: 4,
      },
      {
        name: "kamal",
        review: "the food is very good",
        date: "03 december 2025",
        rating: 4,
      },
      {
        name: "kamal",
        review: "the food is very good",
        date: "03 december 2025",
        rating: 4,
      },
      {
        name: "kamal",
        review: "the food is very good",
        date: "03 december 2025",
        rating: 4,
      },
      {
        name: "kamal",
        review: "the food is very good",
        date: "03 december 2025",
        rating: 4,
      },
      {
        name: "kamal",
        review: "the food is very good",
        date: "03 december 2025",
        rating: 4,
      },
      {
        name: "kamal",
        review: "the food is very good",
        date: "03 december 2025",
        rating: 4,
      },
      {
        name: "kamal",
        review: "the food is very good",
        date: "03 december 2025",
        rating: 4,
      },
    ];
function handleRate(rate) {
    if (rate === 5) {
        return "😁 Amazing";
    } else if (rate >= 4) {
        return "😊 Good";
    } else if (rate >= 3) {
        return "😐 Ok";
    } else if (rate >= 2) {
        return "😒 Bad";
    } else if (rate >= 1) {
        return "😡 Terrible";
    } else {
        return "😁 Amazing";
    }
}

  return (
    <div className='lg:pe-2'>
      <p className='mb-2 text-lg text-[#262626] font-semibold'>{langText.reviews[lang]}</p>
      <div className="flex flex-col gap-2 mt-2">
        {
          reviews.slice(0, reviewsToShow).map((review, index) => (

        <div className='bg-[#f5f5f5] p-4 border-[#00000020] border rounded-xs'>
            <div className="flex items-center justify-between text-[#6b6b6b]">
                <div className="flex items-center gap-20 text-sm">
                <p>{handleRate(review.rating)}</p>
                <p>{review.name}</p>
                </div>
                <p className='text-xs'>{review.date}</p>
            </div>
            <p className="lg:mt-4 mt-3 text-[#262626] text-sm">{review.review}</p>
        </div>
          ))
        }
        {reviewsToShow<reviews.length &&

            <button onClick={()=>{setReviewsToShow((prev)=>prev+5)}}  className='cursor-pointer bg-[#f5f5f5] p-4 border-[#00000020] border rounded-xs'>
            <p className='text-primary text-sm' >{langText.readMore[lang]}</p>
        </button>
        }
      </div>
    </div>
  )
}

export default Reviews
