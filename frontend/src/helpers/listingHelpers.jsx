export const ratingCalc = (reviews) => {
  let count = 0;
  let reviewTotalScore = 0;
  reviews.forEach((review) => {
    count += 1;
    reviewTotalScore += parseInt(review.rating);
  });
  let avgReview = 0;
  if (count > 0 && !isNaN(reviewTotalScore)) {
    avgReview = (reviewTotalScore / count).toFixed(1);
  }
  return {
    reviewCount: count,
    reviewAvg: avgReview
  }
}
